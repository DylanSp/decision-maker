# Decision Maker

[![Build Status](https://travis-ci.com/DylanSp/decision-maker.svg?branch=master)](https://travis-ci.com/DylanSp/decision-maker)

This repo contains all the code for the Decision Maker project, including AWS infrastructure to host it. See the READMEs in subfolders for information on various parts of the project.

## Docker setup
The Dockerfile runs tests as well as building the project. `common` must be built first, as both the backend and frontend depend on it. `frontend` is next to be built, so its bundled output can be referenced and served by the backend.

## CI Process

All changes to this project should go through pull requests.

### Infrastructure changes
When making changes in the `infrastructure` folder , creating a pull request causes Travis CI to create a [CloudFormation changeset](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html), which should be manually examined in the AWS console to verify that the changes are correct. Merging the PR to `master` will execute the change set.

# License

MIT