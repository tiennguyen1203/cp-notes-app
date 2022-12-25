const Sidebar = ({
  notes,
  onAddNote,
  onDeleteNote,
  activeNote,
  setActiveNote
}) => {
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <button onClick={onAddNote}>Add</button>
      </div>
      <div className="app-sidebar-notes">
        {sortedNotes?.length ? (
          sortedNotes.map(({ id, title, body, updatedAt }, i) => (
            <div
              className={`app-sidebar-note ${id === activeNote && "active"}`}
              onClick={() => setActiveNote(id)}
              key={id}
            >
              <div className="sidebar-note-title">
                <strong>{title}</strong>
                <button onClick={e => onDeleteNote(id)}>Delete</button>
              </div>

              <p>{body && body.substr(0, 100) + "..."}</p>
              <small className="note-meta">
                Last Modified{" "}
                {new Date(updatedAt).toLocaleDateString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </small>
            </div>
          ))
        ) : (
          <div className="no-notes">No Notes</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
