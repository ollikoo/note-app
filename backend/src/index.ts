import express, { Response, NextFunction } from "express";
import cors from "cors";
import { generateToken, validateToken } from "./jwt.js";
import dotenv from "dotenv";
import { UserAuthRequest } from "./types/UserAuthRequest.js";
import { ulid } from "ulid";
import { hash, compare } from "bcrypt";
import { User } from "./types/User.js";
import cookieParser from "cookie-parser";
import client from "./client.js";
import { Note } from "./types/Note.js";
dotenv.config();

// Setup Express
const app = express();
app.use(
  cors({
    credentials: true,
    preflightContinue: true,
    origin: ["http://localhost:3000", "http://localhost:8080"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Default endpoint
app.get("/", (req: UserAuthRequest, res: Response) => {
  res.status(200).json({ message: "alive" });
});

// Endpoint for creating a new user
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      // Validate user inputs
      if (username.length === 0) {
        return res.status(403).send({
          error: true,
          message: "Invalid username",
        });
      }
      if (password.length < 8) {
        return res.status(403).send({
          error: true,
          message: "Password length must be atleast 8 characters",
        });
      }

      // Check if user already exists
      const userName = await client.hGetAll(`user:${username}`);
      if (userName.username === username) {
        return res.status(409).send({
          error: true,
          message: "User already exists",
        });
      }

      // Encrypt password
      const hashedPassword = await hash(password, 10);

      // Generate token for user
      const token = generateToken(username);

      // Save user
      const newUser: User = {
        username: `user:${username}`,
        password: hashedPassword,
      };

      const [firstRes, secondRes, thirdRes, saveRes] = await client
        .multi()
        .hSet(newUser.username, newUser)
        .sAdd(`user:index`, `user:${username}`)
        .hSet(`user:${username}`, {
          username: username,
          password: hashedPassword,
        })
        .bgSave()
        .exec();

      if (
        typeof firstRes === "number" &&
        typeof secondRes === "number" &&
        typeof thirdRes === "number"
      ) {
        return res.status(201).send({
          message: "User created",
          createdUser: thirdRes,
          data: { token },
        });
      }
    }
  } catch (err: any) {
    return res.status(500).send({
      error: true,
      message: `User save error: ${err.message}`,
    });
  }
});

// Endpoint for login
app.post("/login", async (req: UserAuthRequest, res: Response) => {
  const { username, password } = req.body;

  const user = await client.hGetAll(`user:${username}`);

  const validatedPassword = await compare(password, user.password);

  if (!user.username || !validatedPassword) {
    return res.status(401).send({
      error: true,
      message: "Invalid login credentials",
    });
  }

  // Generate token for user
  const token = generateToken(username as string);

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in" });
});

// Endpoint for logout
app.get("/logout", validateToken, (req: UserAuthRequest, res: Response) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logged out" });
});

// Endpoint for creating a new note
app.post(
  "/notes",
  validateToken,
  async (req: UserAuthRequest, res: Response) => {
    try {
      const noteId = ulid();
      const username = req.username;
      const timestamp = Math.floor(new Date().getTime() / 1000);

      const newNote: Note = {
        noteId: `note:${noteId}`,
        username: username as string,
        content: req.body.content,
        isCompleted: "false",
        createdAt: `${timestamp}`,
        completedAt: "0",
      };

      if (newNote) {
        // Save note
        const [firstRes, secondRes, saveRes] = await client
          .multi()
          .hSet(newNote.noteId, newNote)
          .sAdd(`note:index`, newNote.noteId)
          .bgSave()
          .exec();

        if (typeof firstRes === "number" && typeof secondRes === "number") {
          const notes = await client.sMembers("note:index");
          const result: any = Promise.all(
            notes.map((noteId: string) => client.hGetAll(noteId))
          );

          result.then((result: any) => {
            return res.status(201).send({
              message: "Note created",
              updated: result?.filter(
                (note: Note) => note.username === username
              ),
            });
          });
        }
      }
    } catch (err: any) {
      return res.status(500).send({
        error: true,
        message: `Note save error: ${err.message}`,
      });
    }
  }
);

// Endpoint for getting all notes
app.get(
  "/notes",
  validateToken,
  async (req: UserAuthRequest, res: Response) => {
    try {
      const username = req.username;
      const notes = await client.sMembers("note:index");
      const result: any = Promise.all(
        notes.map((noteId: string) => client.hGetAll(noteId))
      );
      result.then((result: any) => {
        return res.status(200).send({
          notes: result?.filter((note: Note) => note.username === username),
        });
      });
    } catch (err: any) {
      return res.status(500).send({
        error: true,
        message: `Error getting notes: ${err.message}`,
      });
    }
  }
);

// Endpoint for updating a note
app.patch(
  "/notes/:noteId",
  validateToken,
  async (req: UserAuthRequest, res: Response) => {
    try {
      const noteId: string = req.params.noteId;

      if (noteId) {
        // Update note
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const note = await client.hGetAll(noteId);
        const result = await client.hSet(noteId, {
          isCompleted: note.isCompleted === "true" ? "false" : "true",
          completedAt: note.completedAt === "0" ? `${timestamp}` : "0",
        });

        if (typeof result === "number") {
          client.bgSave();
          const updated = await client.hGetAll(noteId);
          return res.status(200).send({
            message: "Note updated",
            updated,
          });
        }
      }
    } catch (err: any) {
      return res.status(500).send({
        error: true,
        message: `Note update error: ${err.message}`,
      });
    }
  }
);

// Endpoint for deleting a note
app.delete(
  "/notes/:noteId",
  validateToken,
  async (req: UserAuthRequest, res: Response) => {
    try {
      const noteId: string = req.params.noteId;

      if (noteId) {
        // Delete note
        const [firstRes, secondRes, saveRes] = await client
          .multi()
          .del(noteId)
          .sRem(`note:index`, noteId)
          .bgSave()
          .exec();

        if (typeof firstRes === "number" && typeof secondRes === "number") {
          const username = req.username;
          const notes = await client.sMembers("note:index");
          const result: any = Promise.all(
            notes.map((noteId: string) => client.hGetAll(noteId))
          );

          result.then((result: any) => {
            return res.status(200).send({
              message: "Note deleted",
              updated: result?.filter(
                (note: Note) => note.username === username
              ),
            });
          });
        }
      }
    } catch (err: any) {
      return res.status(500).send({
        error: true,
        message: `Note delete error: ${err.message}`,
      });
    }
  }
);

// Setup the port and listen connections
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
