#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ora from 'ora';

const execPromise = util.promisify(exec);

const $filename = fileURLToPath(import.meta.url);
const $dirname = dirname($filename);

// Display framework name with chalk and figlet
function displayFrameworkName() {
  console.log(
    chalk.bold.cyan(
      figlet.textSync('Kawkab Framework', {
        font: 'Slant', 
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
}

// Function to recursively copy files and directories
async function copyDirectoryRecursive(src, dest, spinner) {
  if (!fs.existsSync(src)) {
    console.error(chalk.red(`❌ Source path "${src}" not found.`));
    spinner.fail('Failed to copy files');
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      await copyDirectoryRecursive(srcPath, destPath, spinner);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
        fs.chmodSync(destPath, stat.mode);
      } catch (err) {
        console.error(chalk.red(`❌ Error copying "${file}": ${err.message}`));
      }
    }
  }
}

// Function to initialize a new project
async function copyTemplate(name) {
  displayFrameworkName();

  const sourceDir = path.resolve($dirname, 'project');
  const destDir = path.join(process.cwd(), name);

  console.log(chalk.cyan(`🚀 Initializing project "${name}"...`));

  const spinner = ora('Copying project files...').start(); 

  try {
    await copyDirectoryRecursive(sourceDir, destDir, spinner);
    spinner.succeed(`Project template created at "${destDir}".`);
  } catch (err) {
    spinner.fail('❌ Failed to copy template.');
    console.error(chalk.red(`❌ Failed to copy template: ${err.message}`));
    return;
  }

  try {
    const { stdout } = await execPromise('npm --version');
    console.log(chalk.green(` npm detected (version: ${stdout.trim()}).`));
  } catch {
    console.error(chalk.red(`❌ npm is not installed. Please install it first.`));
    return;
  }

  const installSpinner = ora(chalk.cyan(`🔧 Installing dependencies...`)).start();  

  try {
    await execPromise('npm install', { cwd: destDir });
    installSpinner.succeed(' Dependencies installed successfully.');
  } catch (err) {
    installSpinner.fail('❌ Failed to install dependencies.');
    console.error(chalk.red(`❌ Failed to install dependencies: ${err.message}`));
    return;
  }

  // Adding a friendly and professional welcome message after project setup
  console.log(chalk.bold.green(`\n🎉 Project "${name}" is ready!`));
  console.log(chalk.yellow(`\n 👉 Next steps:`));
  console.log(chalk.yellow(`   $ cd ${name}`));
  console.log(chalk.yellow(`   $ npm run dev`));

  console.log(chalk.cyan(`\nCongratulations! Your project has been successfully set up with Kawkab Framework.`));
  console.log(chalk.cyan(`We sincerely thank you for choosing Kawkab Framework for your project!`));
  console.log(chalk.cyan(`Happy coding! 😀`));
}

program
  .command('init <name>')
  .description('Initialize a new project with the specified name')
  .action(copyTemplate);

program.parse(process.argv);
