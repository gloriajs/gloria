# CONTRIBUTING

Contributions in the form of ideas, designs, and code are always welcome no matter how large or small. If you want to help but are not sure where to start, you can check out our project's [Issues](https://github.com/gloriajs/gloria/issues).

## Setup

We do use Yarn in this project, so:

> Install yarn: https://yarnpkg.com/en/docs/install

Afterward, clone our repository:

```sh
$ git clone https://github.com/gloriajs/gloria.git
$ cd gloria/
$ yarn
```

When adding a new dependency to our project, we use `yarn add [package name]` rather than `npm install [--save or --save-dev] [package name]`. It keeps our `yarn.lock` file (and therefore our dependencies) consistent across all our contributors.

## Running locally

Run `npm link` inside the root folder to use your local development `gloria` instead of the globally installed one.

or just use `node`:

```sh
$ node bin/gloria [command]
```

## Testing

```sh
$ npm test
```

## Pull Requests

We actively welcome any pull requests that are backed up by current issues or by some small summary explaining what it is you're contributing.

1. Fork the repo and create a branch from your fork's `master`. Name the branch after what it is you're doing, like `fixing-server` or `adding-voice-support`.
2. If you've added code that should be tested, add tests to the `test/` directory.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.

## License

By contributing to Gloria, you agree that your contributions will be licensed
under its [Apache license](LICENSE).
