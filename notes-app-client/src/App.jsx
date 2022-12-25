import { useEffect, useState } from "react";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { axios } from "./api/axios";
import { v4 as uuid } from "uuid";
import { mapNote } from "./helpers/note-mapper";

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
  }, []);

  const onAddNote = async () => {
    const newNote = {
      title: "Untitled Note",
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

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
