import React from "react";
import { Note } from "../types/Note";
import { Fieldset, Divider, Button, Tab, Tabs, TabBody } from "react95";
import styled from "styled-components";

type NoteListProps = {
  notes: Note[];
  updateNote: any;
  deleteNote: any;
};

const Wrapper = styled.div`
  margin-bottom: 32px;

  [class*="Checkbox"] {
    flex-shrink: 0;
    position: absolute;
    top: 8px;
  }

  input[type*="checkbox"] {
    top: 8px;
  }

  [class*="LabelText"] {
    margin-left: 32px;
  }

  .note-wrap {
    display: flex;
    flex-direction: column;
    padding: 16px 0;

    h3 {
      font-size: 16px;
      font-weight: bold;
      position: absolute;
    }

    p {
      margin-left: 32px;
    }

    .buttons {
      margin-top: 16px;
      margin-left: 32px;

      button {
        margin-right: 8px;
      }
    }

    .note-divider {
      margin-top: 16px;
    }
  }
`;

const NoteList = ({ notes, updateNote, deleteNote }: NoteListProps) => {
  const [tab, setTab] = React.useState<number>(0);

  const handleChange = (e: any, value: number) => setTab(value);

  const done: number = notes?.filter(
    (note: Note) => note.isCompleted === "true"
  )?.length;
  const undone: number = notes?.filter(
    (note: Note) => note.isCompleted === "false"
  )?.length;

  return (
    <Wrapper>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0}>{`Undone (${undone})`}</Tab>
        <Tab value={1}>{`Done (${done})`}</Tab>
      </Tabs>
      <TabBody>
        <Fieldset label="Notes">
          {notes
            ?.filter((note: Note) => {
              if (tab === 0) {
                return note.isCompleted === "false";
              } else {
                return note.isCompleted === "true";
              }
            })
            .sort(
              (a: Note, b: Note) =>
                parseInt(a.createdAt) - parseInt(b.createdAt)
            )
            .map((note: Note, i: number, arr: Note[]) => {
              return (
                <div className="note-wrap" key={note.noteId}>
                  <h3>{i + 1}.</h3>
                  <p>{note.content}</p>
                  <div className="buttons">
                    <Button onClick={() => updateNote(note.noteId)}>
                      {note.isCompleted === "false" ? "✅" : "❎"}
                    </Button>
                    <Button onClick={() => deleteNote(note.noteId)}>🗑️</Button>
                  </div>
                  {i < arr.length - 1 && <Divider className="note-divider" />}
                </div>
              );
            })}
        </Fieldset>
      </TabBody>
    </Wrapper>
  );
};

export default NoteList;
