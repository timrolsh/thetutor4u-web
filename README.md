# TheTutor4u Web

This project is built with Nextjs, which makes it easy to build a multi page web app, do page routing, do server side rendering and static page generation, all while using React.

## Requirements

-   Nodejs (LTS version is fine): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
-   Yarn (package manager): Run command once nodejs is installed:

```shell
npm install --global yarn
```

## Getting Started

After cloning the repository, run the following to begin working on the project:

-   run `yarn` with no args: yarn will use the yarn.lock file to download all necessary dependencies and put them in the node_modules folder
-   run `yarn dev` to launch the development enviornment. Anytime a change is made to any file in the file system, the enviornment will refresh and the page will soft reload. Nextjs will log everytime it re-compiles the page to the terminal

Eventually when putting in production, run `yarn build` and then `yarn start` to start an instace of the server

## Note about NPM/Yarn

This project uses Yarn as its package manager, please do not use NPM while working in the project, it will cause conflicts with dependencies and lead to problems running the code. Switching between the two package managers in the project will result in conflicts within the yarn.lock file. Please do not modify the yarn.lock file manually as well, the package manager takes care of all of that for you.
