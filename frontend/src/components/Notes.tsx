import React from "react";
import axios from "axios";
import { Note } from "../types/Note";
import styled from "styled-components";
import {
  Window,
  WindowHeader,
  Button,
  WindowContent,
  Hourglass,
  TextField,
} from "react95";
import { Link } from "react-router-dom";
import Login from "./Login";
import NoteList from "./NoteList";
import { Resizable } from "react-resizable";
import Draggable from "react-draggable";

type NoteProps = {
  setError: any;
  setSuccess: any;
};

type Size = {
  width: number;
  height: number;
};

const Notes = ({ setError, setSuccess }: NoteProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [size, setSize] = React.useState<Size>({ width: 600, height: 600 });
  const [newNote, setNewNote] = React.useState<string>("");

  const getNotes = React.useCallback(async () => {
    setIsLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_URL}/notes`)
      .then((response) => {
        if (response.data) {
          if (response?.status === 200) {
            setIsLoggedIn(true);
            setNotes(response.data.notes);
            setTimeout(() => setIsLoading(false), 1500);
          }
        }
      })
      .catch((err: any) => {
        console.log("Error getting notes:", err);
        setNotes([]);
        setIsLoggedIn(false);
        setTimeout(() => setIsLoading(false), 1500);
      });
  }, []);

  React.useEffect(() => {
    getNotes();
  }, [getNotes, isLoggedIn]);

  const logOut = React.useCallback(async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/logout`)
      .then((response) => {
        if (response.data) {
          setIsLoggedIn(false);
        }
      })
      .catch((err: any) => {
        console.log("Logout error:", err);
      });
  }, [setIsLoggedIn]);

  const updateNote = React.useCallback(
    async (noteId: string) => {
      await axios
        .patch(`${process.env.REACT_APP_API_URL}/notes/${noteId}`)
        .then((response) => {
          const updatedNote: Note = response.data?.updated;
          if (updatedNote) {
            const newNotes = [...notes];
            const i = newNotes.findIndex(
              (x: Note) => x.noteId === updatedNote.noteId
            );
            if (i > -1) {
              newNotes[i] = updatedNote;
              setNotes(newNotes);
            }
          }
        })
        .catch((err: any) => {
          console.log(`Error updating note: ${err}`);
          setError("Error updating note, check console");
        });
    },
    [notes, setError]
  );

  const deleteNote = React.useCallback(
    async (noteId: string) => {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/notes/${noteId}`)
        .then((response) => {
          const updatedNotes: Note[] = response.data?.updated;

          if (updatedNotes) {
            setNotes(updatedNotes);
          }
        })
        .catch((err: any) => {
          console.log(`Error deleting note: ${err}`);
          setError("Error deleting note, check console");
        });
    },
    [setError]
  );

  const saveNote = React.useCallback(
    async (newNote: string) => {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/notes`, { content: newNote })
        .then((response) => {
          console.log("response:", response);
          if (response.data) {
            setNewNote("");
            const updatedNotes: Note[] = response.data?.updated;
            if (updatedNotes) {
              setNotes(updatedNotes);
            }
          }
        })
        .catch((err: any) => {
          console.log(`Error saving note: ${err}`);
          setError("Error saving note, check console");
        });
    },
    [setError]
  );

  const onResize = (event: any, { element, size, handle }: any) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <Wrapper>
      <Draggable
        defaultPosition={{
          x: window.innerWidth / 2 - 300,
          y: window.innerHeight / 2 - 300,
        }}
        handle=".window-title"
      >
        <Resizable
          height={size.height}
          width={size.width}
          handle={<div className="resize-handle" />}
          onResize={onResize}
        >
          <div
            className="box"
            style={{
              width: size.width + "px",
              height: size.height + "px",
            }}
          >
            <Window id="window" className="window">
              <WindowHeader className="window-header">
                <span className="window-title">Notes.exe</span>
                <Link to="/">
                  <Button className="close-button">
                    <span className="close-icon" />
                  </Button>
                </Link>
              </WindowHeader>
              <WindowContent
                className="window-content"
                style={{ maxHeight: size.height - 77 }}
              >
                {!isLoggedIn && !isLoading && (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setError={setError}
                    setSuccess={setSuccess}
                  />
                )}
                {isLoggedIn && !isLoading && (
                  <>
                    <NoteList
                      notes={notes}
                      updateNote={updateNote}
                      deleteNote={deleteNote}
                    />
                    <div className="new-note-wrap">
                      <p>Write a new note</p>
                      <TextField
                        className="new-note-field"
                        multiline
                        rows={4}
                        value={newNote}
                        onChange={(e: any) => setNewNote(e.target.value)}
                        fullWidth
                        placeholder="Type here..."
                      />
                      <div className="buttons">
                        <Button
                          disabled={newNote === ""}
                          onClick={() => saveNote(newNote)}
                        >
                          💾 Save
                        </Button>
                        <Button className="submit" onClick={() => logOut()}>
                          <span style={{ marginRight: "12px" }}>🔒</span>Logout
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {isLoading && (
                  <div className="loader">
                    <Hourglass size={32} />
                    Loading...
                  </div>
                )}
              </WindowContent>
            </Window>
          </div>
        </Resizable>
      </Draggable>
    </Wrapper>
  );
};

export default Notes;

const Wrapper = styled.div`
  .react-resizable {
    position: fixed;
    max-height: calc(100vh - 48px);
    max-width: 100vw;
    overflow: hidden;
  }

  .window {
    max-height: calc(100vh - 48px);
    width: 100%;
    height: 100%;
    max-width: 100vw;
    overflow; hidden;
    position: relative;
  }

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: 
  }

  .window-title {
    width: 100%;
  }

  .close-button {
    top: 2px;
  }

  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      background: ${({ theme }) => theme.materialText};
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .window-content {
    overflow-y: scroll;
  }

  .resize-handle {
    border: 1px solid black;
    width: 6px;
    height: 149px;
    position: absolute;
    right: 1px;
    bottom: -62px;
    cursor: nwse-resize;
    transform: rotate(45deg);
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

   .new-note-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: 8px;
    }

    .buttons {
      display: flex;
      margin-top: 16px;
      justify-content: space-between;
      
      button {}
    }
  }
`;
