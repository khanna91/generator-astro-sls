
# Astro Serverless Generator

Yeoman generator for building Serverless project on NodeJS.
The principle of the project structure is isolation, so multiple developers can work on the same project without high dependency.

## Requirements

 - [Node v10+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Install:
```bash
npm install -g yo generator-astro-sls
```

Generate a new project:

```bash
yo astro-sls
```
Choose your project, either service or fullstack

### Generator CLI

Generate a new Handler:

```
yo astro-sls:handler
```

Generate a new middleware:

```
yo astro-sls:middleware
```

Generate a new service:

```
yo astro-sls:service
```

Generate a new utility:

```
yo astro-sls:util
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn deploy
```

## License

[MIT License](README.md) - [Rahul Khanna](https://github.com/khanna91)
