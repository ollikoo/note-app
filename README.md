# Note App

## Assignment

A TODO list application that can be restarted.

## Solution

### Dockerized applications with modern tech stack and retro-ish UI components

- A frontend with React, Typescript, Sass, Styled Components and React95
- A backend with Node.js, Typescript, Express.js, Redis and JWT authentication

## To run application in Docker

1. Download and install Docker and node.js.

2. To generate a secret token, navigate to `backend` directory and run `npm run generate-secret` and then copy the generated token.

3. Copy `.env.example` file and name it as `.env` and then paste the generated token as value of `TOKEN_SECRET`.

4. To build and start containers, run `docker-compose --env-file ./backend/.env up` in the root directory. Applications will start and the UI is available at [http://localhost:3000](http://localhost:3000).

5. RedisInsight GUI is available at [http://localhost:8001](http://localhost:8001).
