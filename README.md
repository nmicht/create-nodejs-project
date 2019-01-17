# Node Project Initializer

[![License][license-image]][license-url] [![version][npm-image]][npm-url]

An [npm initializer][npm/init] to scaffold a node project and include basic tools like lint, testing, etc.

> _`npm init <initializer>` can be used to set up a new or existing npm package._  
> _`initializer` in this case is an npm package named `create-<initializer>`, which will be installed by `npx`, and then have its main bin executed -- presumably creating or updating `package.json` and running any other initialization-related operations._  
> _[&mdash; Source: `docs.npmjs.com`][npm/init]_

## Requirements

- `npm >= 6.5`
- `node >= 10.9`

## Usage

`npm init node-project path/to/project`

## What it does

1. Create the folder for the new project
1. Guide you through a questionnarie to setup the project
2. Initialize a git repo
3. Copy the template files (src, eslintrc, gitignore, readme, etc)
4. Can create a Github repository
5. Install eslint
5. Install the selected testing dependencies
6. Generate package.json with all the project details
7. Commit and push the initial commit

## About this package

So, this started as a dry thing.  
I'm not expert with NodeJS, but every time that I start a new project, I hate to go to other project, copy files like eslintrc, editorconfig, install the same dependencies, create folder structure, etc.  
So, the idea is to have a create package to use it in the form of:  
`npm init node-project path/to/project`
and with this have a new folder my-new-project with everything ready to work.  

I know there are a lot of similar packages out there, but the idea is to learn more about nodejs api, handling files, packages, etc.

## Future features

1. Fix the structure of modules, classes and etc
4. Add unit testing
7. Add options to create the project with params instead of questionnaire
10. Add a good error handler
11. Color for the console messages
12. Modify template structure (the one that is generated in the new project) to include unit test
13. Include license files to the template copy/update process
14. A logger ? (just for learning)
17. Ability to handle auth for different github accounts
18. Option to questionnaire with all the default values

## Github Auth

If you are planning to allow this script to create your github repositories, is required to generate a Github Token.

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
     [X] delete_repo
```
3. Click Generate token.
4. Copy the generated string to a safe place, such as a password safe.
5. Open Terminal and add the github token. Note: The file may be empty, you can use `auth-example.json` to copy and paste.

```
# nano ~/auth.json

{
  "github-oauth": {
    "github.com": "YOUR_TOKEN"
  }
}
```



[license-url]: LICENSE
[license-image]: https://img.shields.io/github/license/ahmadnassri/node-create.svg?style=for-the-badge&logo=circleci

[npm-url]: https://www.npmjs.com/package/create-nodejs-project
[npm-image]: https://img.shields.io/npm/v/@nmicht/create.svg?style=for-the-badge&logo=npm

[npm/init]: https://docs.npmjs.com/cli/init#description
