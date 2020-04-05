# api-rest-using-nodejs-workshop

## Summary
This repo tries to help understand how to build an REST API using node.js. It contains several projects (in folders) that represent the evolution of it, starting on the most basic and then adding certain libraries to solve specific challenges: (using babel, using typescript, adding request validation using joi, routes handling, adding security, documenting using swagger)

## Use cases
Each folder contains that is represents the evolution of this workshop. Each project can be considered as a part or step where specific technology or library is applied to solve a certain problem.

- **01-basic**: Part 1: The simplest case, an basic api rest demo with pure javascript (no babel, no typescript), but using linter eslint.
- **02-with-babel**: Part 2, Implementing the code using babel
- **03-request-validation-with-joi**: Part 3: It's time to validate http request from body and path params
- **04-documenting-with-swagger**: Part 4: Documenting our API with open api (swagger)
- **05-logging**: Part 5: Improve error handling and logging
- **06-unit-tests**: Part 6: Add unit testing
- **07-add-security**: Part 7: Secure our API
- **08-improving (compression, handling headers, etc)**: Part 8: Improving our API with other configurations

## Projects folder structures
All projects contains similar folders structure such as:
- /src
  - /controllers
  - /models
  - /routes
  - /schemas
  - /repositories
  - /middlewares
  - /utils
