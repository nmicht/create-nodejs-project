#!/usr/bin/env node

const Project = require('./project');

(async () => {
  // TODO Work with args

  const destPath = await Project.getDestPath(process.argv[2]);

  const details = await Project.getDetails(destPath);

  const project = new Project(details);

  await project.createFolder();

  await project.copyTemplateFiles();

  await project.updateTemplateFiles();

  // TODO Copy license and update with project data

  await project.initializeGitRepository();

  await project.installDependencies();

  await project.commit();

  await project.createGithubRepository();

  await project.push();
})();
