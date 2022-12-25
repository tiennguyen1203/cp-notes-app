import { useEffect, useState } from "react";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { axios } from "./api/axios";
import { v4 as uuid } from "uuid";
import { mapNote } from "./helpers/note-mapper";
import * as io from "socket.io-client";
const socket = io.connect("http://127.0.0.1:3001/notes", {});

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  useEffect(() => {
    const generateUserId = () => {
      if (!localStorage.userId) {
        localStorage.setItem("userId", uuid());
      }
    };

    const fetchNotes = async () => {
      const res = await axios.get(`/notes`);
      const mappedNotes = (res.data || []).map(note => mapNote(note));
      setNotes(mappedNotes);
    };

    generateUserId();
    fetchNotes();

    socket.emit("room-join-requested", { room: localStorage.userId });
    socket.on("note-updated", updatedNote => {
      const mappedUpdatedNote = mapNote(updatedNote);
      setNotes(value => {
        const updatedNotes = value.map(note => {
          if (note.id === updatedNote.id) {
            return mappedUpdatedNote;
          }

          return note;
        });

        return updatedNotes;
      });
    });
  }, []);

  const onAddNote = async () => {
    const newNote = {
      title: "",
      body: "",
      userId: localStorage.userId
    };

    const res = await axios.post(`/notes`, newNote);
    const createdNote = res.data;
    const mappedCreatedNote = mapNote(createdNote);

    setNotes([mappedCreatedNote, ...notes]);
    setActiveNote(mappedCreatedNote.id);
  };

  const onDeleteNote = async noteId => {
    await axios.delete(`/notes/${noteId}`);
    setNotes(notes.filter(({ id }) => id !== noteId));
  };

  const onUpdateNote = async updateNoteInfo => {
    const res = await axios.put(`/notes/${updateNoteInfo.id}`, {
      title: updateNoteInfo.title,
      body: updateNoteInfo.body
    });

    const updatedNote = res.data;
    const mappedUpdatedNote = mapNote(updatedNote);
    const updatedNotesArr = notes.map(note => {
      if (note.id === updateNoteInfo.id) {
        return mappedUpdatedNote;
      }

      return note;
    });

    setNotes(updatedNotesArr);
  };

  const onUpdateFullText = async updateNoteInfo => {
    socket.emit("note-update-requested", {
      ...updateNoteInfo,
      updatedAt: new Date().toISOString()
    });
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes.map(e => ({ ...e, title: e.title || "Untitled note" }))}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main
        activeNote={getActiveNote()}
        onUpdateNote={onUpdateNote}
        onUpdateFullText={onUpdateFullText}
      />
    </div>
  );
}

export default App;
