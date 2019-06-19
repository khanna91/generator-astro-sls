# <%= name %>
<%= description %>

## Requirements

 - [Node v10+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Install dependencies:

```bash
yarn
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn deploy
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Jest
yarn test

# run unit tests with coverage
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch
```

## Validate

```bash
# run lint and tests
yarn validate
```

## License

[MIT License](README.md) - [<%= author %>]
