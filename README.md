<img width="75px" height="75px" align="right" alt="Create NodeJS Project Logo" src="https://raw.githubusercontent.com/nmicht/create-nodejs-project/master/assets/create-nodejs-project.png" title="Create NodeJS Project"/>

# Node.js Project Initializer

[![License][license-image]][license-url] [![version][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

An [npm initializer][npm/init] to scaffold a node project and include basic tools like lint, testing, etc.

> _`npm init <initializer>` can be used to set up a new or existing npm package._  
> _`initializer` in this case is an npm package named `create-<initializer>`, which will be installed by `npx`, and then have its main bin executed -- presumably creating or updating `package.json` and running any other initialization-related operations._  
> _[&mdash; Source: `docs.npmjs.com`][npm/init]_

## Requirements

- `npm >= 6.5`
- `node >= 10.12.0`

## Usage

1. Install the package as global
```
npm install -g create-nodejs-project
```

2. You will be prompted for your Github information  
If you do not have the information at the moment, you can keep it empty.  
In order to create projects with Github integration, you will need to add the authentication information later. See [Github Auth](#configure-Github-authentication)

3. Create your project
```
npm init nodejs-project path/to/new/project
```

## What it does

1. Create the folder for the new project
1. Guide you through a questionnaire to setup the project
2. Initialize a git repository
3. Copy the template files (src, eslintrc, gitignore, readme, etc)
4. Create a Github repository
5. Install eslint dependencies
5. Install the selected testing dependencies
6. Generate package.json with all the project details
7. Commit and push the initial commit
8. Generate the license file

## About this package

Every time that I start a new project in Node.js, I hate to go to other project folder, copy files like eslintrc, editorconfig; install the same dependencies, create folder structure, etc.

With this in mind, the motivation to build this package started as a **DRY** (Do not repeat yourself) thing.   

This package is intended to automated the initialization of new Node.js projects and with this have a new folder with everything ready to work, basically an scaffolding tool.  


## Future features

1. Unit testing
7. Options to create the project with parameters instead of questionnaire
10. A good error handler
11. Color for the console messages
12. Improve the template structure (the one that is generated in the new project) to include unit test
18. Option to questionnaire with all the default values
2. Logic to handle multiple authentication files and multiple Github accounts

## Configure Github Authentication

If you are planning to allow this script to create your Github repositories, is required to generate a Github Token.

1. Visit https://github.com/settings/tokens.
2. Click Generate new token.
```
 Token Description: (your computer name)
 Scopes:
     [X] repo
         [X] repo:status
         [X] repo_deployment
         [X] public_repo
         [X] repo:invite
```
3. Click Generate token.
4. Copy the generated string to a safe place, such as a password safe.
5. Open Terminal and add the Github token.

```
# nano /YOUR-NODE_MODULES-PATH/create-nodejs-project/create-nodejs-settings.json

...
...
   "githubAuth": {
     "user": "YOUR_USER",
     "token": "YOUR_TOKEN"
   }
...
...
```



[license-url]: LICENSE
[license-image]: https://img.shields.io/github/license/nmicht/create-nodejs-project.svg?style=for-the-badge&logo=appveyor

[npm-url]: https://www.npmjs.com/package/create-nodejs-project
[npm-image]: https://img.shields.io/npm/v/create-nodejs-project.svg?style=for-the-badge&logo=npm

[npm/init]: https://docs.npmjs.com/cli/init#description

[downloads-url]: https://www.npmjs.com/package/create-nodejs-project
[downloads-image]: https://img.shields.io/npm/dt/create-nodejs-project.svg?style=for-the-badge
