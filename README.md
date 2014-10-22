# Running Router


>Running Router randomly generates running routes of a given length and difficulty level based on user selected start and end points.

## Team

  - __Product Owner__: Steve Sharp
  - __Scrum Master__: Greg Nisbet
  - __Development Team Members__: Johnny Liang, Satoko Lom

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Workflow

![workflow diagram](http://i.imgur.com/p0e4tQK.png)

## Build Instructions

From the Coral-Weapon directory, do the following

```sh
npm install
bower install
gulp build-all
gulp deploy:server
```

You may need to copy files from review to dist. gulp deploy:server will serve from the dist folder, which contains
minified versions of code inside review.

```sh
gulp deploy
```
