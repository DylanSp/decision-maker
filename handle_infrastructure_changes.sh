#!/bin/bash

set -x

stack_name="decision-maker-infra"
infra_changes_exist=$(grep infrastructure <(git diff --name-only "$TRAVIS_COMMIT_RANGE"))

if [[ "$infra_changes_exist" ]]; then
    if [[ "$TRAVIS_EVENT_TYPE" == "pull_request" ]]; then
        # create changeset
        aws cloudformation create-change-set --stack-name "$stack_name" \
        --template-body file://infrastructure/infrastructure.yml \
        --parameters \
            "ParameterKey=DBRootPassword,ParameterValue=$DB_ROOT_PASS" \
            "ParameterKey=DomainCertARN,ParameterValue=$DOMAIN_CERT_ARN" \
            "ParameterKey=LambdaBucket,ParameterValue=$LAMBDA_BUCKET" \
        --capabilities CAPABILITY_IAM \
        --change-set-name "decision-maker-changeset-$TRAVIS_PULL_REQUEST_SHA"

        # create comment on PR
        api_url="https://api.github.com/repos/DylanSp/decision-maker/issues/$TRAVIS_PULL_REQUEST/comments"
        comment_text="PR contains infrastructure changes; review change set before merge!"

        curl -X POST "$api_url" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"body\": \"$comment_text\"}"
    elif [[ $"TRAVIS_EVENT_TYPE" == "push" ]]; then
        aws cloudformation execute-change-set --stack-name "$stack_name" \
        --change-set-name "decision-maker-changeset-$TRAVIS_COMMIT"
    fi
fi
