#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { program } from 'commander';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert exec to return a Promise for better async/await usage
const execPromise = util.promisify(exec);

const $filename = fileURLToPath(import.meta.url);

const $dirname = dirname($filename);

// Function to recursively copy files and directories with permission preservation
async function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ The source path "${src}" does not exist. Please verify the directory.`);
    return;
  }

  // Normalize paths to handle OS differences
  src = path.normalize(src);
  dest = path.normalize(dest);

  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`📁 Created destination directory: ${dest}`);
  }

  // Read all files and directories in the source directory
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    // Check if the current item is a directory or a file
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // If it's a directory, recursively copy it and preserve permissions
      console.log(`🔄 Copying directory: ${file}`);
      
      // Ensure the destination directory exists with the same permissions
      fs.mkdirSync(destPath, { recursive: true, mode: stat.mode });
      
      await copyDirectoryRecursive(srcPath, destPath);
    } else {
      // If it's a file, copy it with original permissions
      try {
        // Copy file with original mode/permissions
        fs.copyFileSync(srcPath, destPath, fs.constants.COPYFILE_FICLONE);
        
        // Explicitly set the file mode to match the source
        fs.chmodSync(destPath, stat.mode);
        
        console.log(`✅ Successfully copied file: ${file} (mode: ${stat.mode.toString(8)})`);
      } catch (err) {
        console.error(`❌ Error copying file "${file}": ${err.message}`);
      }
    }
  }
}

// Function to copy the template files and install dependencies
async function copyTemplate(name) {
  // Get the source directory as a folder inside the package (project-template)
  const sourceDir = path.resolve($dirname, 'project');  // This should be the folder inside your package
  const destDir = path.join(process.cwd(), name);

  console.log(`🚀 Starting the project initialization for "${name}"...`);

  try {
    // Copy files from the template directory to the destination recursively
    console.log(`📂 Copying project template from "${sourceDir}" to "${destDir}"...`);
    await copyDirectoryRecursive(sourceDir, destDir);
    console.log(`✅ Project template copied successfully to "${destDir}"!`);
  } catch (err) {
    console.error(`❌ Error during template copy: ${err.message}`);
    return;
  }

  // Check if npm is installed
  try {
    const { stdout, stderr } = await execPromise('npm --version');
    if (stderr) {
      console.error(`❌ Error checking npm version: ${stderr}`);
      return;
    }
    console.log(`✅ npm version: ${stdout}`);
  } catch (error) {
    console.error(`❌ npm is not installed or not found: ${error.message}`);
    return;
  }

  // Install dependencies using npm
  console.log(`🔧 Installing dependencies for "${name}"...`);

  try {
    const { stdout, stderr } = await execPromise('npm install', { cwd: destDir });
    if (stderr) {
      console.error(`❌ Error during npm install: ${stderr}`);
    } else {
      console.log(`✅ Dependencies installed successfully!`);
      console.log(stdout);
    }
  } catch (error) {
    console.error(`❌ Error executing "npm install": ${error.message}`);
    console.error(error);
    return;
  }

  // Provide a message to the user to `cd` into the project directory and run dev
  console.log(`🎉 Setup completed successfully!`);
  console.log(`👉 You can now go to your project folder by running:`);
  console.log(`$ cd ${name}`);

  // Replace the actual "npm run dev" execution with a message for the user
  console.log(`🚀 To start the development server, run:`);
  console.log(`$ npm run dev`);
}

program
  .command('init <name>')
  .description('Initialize a new project with the specified name')
  .action(copyTemplate);

program.parse(process.argv);
