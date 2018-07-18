# Desktop app

## Local development

## Building distributable packages

We use [electron-builder](https://www.electron.build/) to package the application for multiple platforms. This tool allows us to build for all three platforms (macOS, Windows and Linux) using Travis CI only.

To build packages on your local macOS machine, follow these steps:

1. Install [Docker](https://www.docker.com/).
1. Install [yarn](https://yarnpkg.com/lang/en/).
1. If needed, you can change the build configuration in the `electron-builder.yml` file. See [docs](https://www.electron.build/configuration/configuration) for available options.
1. Build for macOS with:

    ```
    yarn # Always reinstall the dependencies if you are building for another platform!
    yarn dist
    ```

1. To build for Windows and Linux, we make use of the `electronuserland/builder:wine` docker image. Launch the instance:

    ```
    docker run --rm -ti \
      --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
      --env ELECTRON_CACHE="/root/.cache/electron" \
      --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
      -v ${PWD}:/project \
      -v ${PWD##*/}-node-modules:/project/node_modules \
      -v ~/.cache/electron:/root/.cache/electron \
      -v ~/.cache/electron-builder:/root/.cache/electron-builder \
      electronuserland/builder:wine
    ```
    
    Once the container is running, you should update the dependencies and then start the build:
    
    ```
    yarn # Always reinstall the dependencies if you are building for another platform!
    yarn dist --linux --windows
    ```
    
    Type `exit` command to exit and halt the container.
    
1. The packages will be stored in the `dist/` directory.