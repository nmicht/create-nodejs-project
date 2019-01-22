#!/usr/bin/env node

const Project = require('./project');

(async () => {
  const destPath = await Project.getDestPath(process.argv[2]);

  console.log(destPath);

  const details = await Project.getDetails(destPath);

  const project = new Project(details);

  await project.createFolder();

  await project.copyTemplateFiles();

  project.initializeGitRepository();

  project.createGithubRepository();

  // TODO Copy license and update with project data

  // await project.updateTemplateFiles();

  await project.installDependencies();

  await project.commit();
  await project.push();
})();
