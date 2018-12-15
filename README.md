# Decision Maker

[![Build Status](https://travis-ci.com/DylanSp/decision-maker.svg?branch=master)](https://travis-ci.com/DylanSp/decision-maker)

This repo contains all the code for the Decision Maker project, including AWS infrastructure to host it. See the READMEs in subfolders for information on various parts of the project.

## Docker setup
The Dockerfile runs tests as well as building the project. `common` must be built first, as both the backend and frontend depend on it. `frontend` is next to be built, so its bundled output can be referenced and served by the backend. A multi-stage build is used; an Ubuntu image runs the build and tests, while an Alpine image serves the build results and contains only production dependencies.

## CI Process

All changes to this project should go through pull requests.

# License

MIT