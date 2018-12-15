#!/bin/bash

set -ex

sudo pip install awscli --upgrade

repository_url="374526984352.dkr.ecr.us-east-1.amazonaws.com"

if [[ "$TRAVIS_EVENT_TYPE" == "pull_request" ]]; then
    tag="pr-$TRAVIS_PULL_REQUEST_SHA"
    image_name="$repository_url/decision-maker:$tag"
    sudo docker build -t "$image_name"
    sudo $(aws ecr get-login --no-include-email --region us-east-1)
    sudo docker push "$image_name"
elif [[ "$TRAVIS_EVENT_TYPE" == "push" ]]; then
    num_parents=$(git cat-file -p "$(git rev-parse HEAD)" | grep -c parent)

    # by definition, if there's more than 1 parent, commit is a merge commit
    if [[ "$num_parents" -gt 1 ]]; then
        merge_commit=$(git rev-parse HEAD^2)    # HEAD^2 will be the merge commit's parent from the branch being merged in
        tag="prod-$merge_commit"
        image_name="$repository_url/decision-maker:$tag"
        sudo docker build -t "$image_name"
        sudo $(aws ecr get-login --no-include-email --region us-east-1)
        sudo docker push "$image_name"
    fi
fi
