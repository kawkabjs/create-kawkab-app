# Create Kawkab  

**`create-kawkab-app`** is a command-line interface (CLI) tool to create projects based on the **Kawkab** framework. This tool helps you quickly start new projects with a template and automatically installs the required dependencies.  

## Features  

- Create a new project based on the Kawkab framework.  
- Automatically installs dependencies using **npm** or **Bun**.  
- Quickly and easily set up new projects.  

## Prerequisites  

- Make sure you have [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) installed on your machine.  
- Ensure that you're using a recent version of your chosen package manager (**npm** or **Bun**).  

## Installation  

### Using npm  

To install the tool globally with **npm**, run:  

```bash  
npm install -g create-kawkab-app  
```  

### Using Bun  

To install the tool globally with **Bun**, run:  

```bash  
bun add -g create-kawkab-app  
```  

## Usage  

To create a new project using the Kawkab framework, you can use either **npx** (with npm) or **bunx** (with Bun):  

### Using npm  

Run the following command to create a new project:  

```bash  
npx create-kawkab-app init <project-name>  
```  

### Using Bun  

Run the following command to create a new project:  

```bash  
bunx create-kawkab-app init <project-name>  
```  

### Example  

If you want to create a new project named `my-kawkab-app`, use the following command:  

- With **npm**:  
  ```bash  
  npx create-kawkab-app init my-kawkab-app  
  ```  

- With **Bun**:  
  ```bash  
  bunx create-kawkab-app init my-kawkab-app  
  ```  

The project template will be copied to the new directory and dependencies will be installed automatically. 