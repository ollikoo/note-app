# Node.js Backend

Provides the server-side functionality for the Notes app. Application uses Express.js for building the API, JSON Web Tokens for authentication and Redis as primary database.

## To run application in development mode

1. To generate a secret token, run `npm run generate-secret` in the project directory and copy the generated token.

2. Copy `.env.example` file and name it as `.env` and then paste the generated token as value of `TOKEN_SECRET`.

3. Run `npm i` and `npm run dev`.

4. Server will listen connections at [http://localhost:8081](http://localhost:8081).

`npm run build` builds the app for production to the `build` folder.

`npm run start` runs the production build from the `build` folder.

## API

`HTTP POST` `/user` `{"username": <username>, "password": <password>}` - Create new user

`HTTP POST` `/login` `{"username": <username>, "password": <password>}` - Login with credentials and set a token as cookie

`HTTP GET` `/logout` - Logout and remove the token cookie

`HTTP POST` `/notes` `{"content": <note_content>}` - Create a new note

`HTTP GET` `/notes` - Get all notes

`HTTP PATCH` `/notes/:noteId` - Mark note completed/uncompleted

`HTTP DELETE` `/notes/:noteId` - Delete note

## Contact

olli.i.karkkainen@gmail.com
