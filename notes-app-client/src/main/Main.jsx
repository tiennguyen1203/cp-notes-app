import { useEffect } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { isNil } from "../helpers/is-nil";

const extractTitleAndBody = fullText => {
  let title = "";
  let body = "";
  if (fullText) {
    title = fullText.split("\n")[0];
    body = fullText.split("\n").slice(1).join("\n");
  }

  return { title, body };
};

const zeroPad = num => {
  return num < 10 ? `0${num}` : num;
};

const formatDate = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();

  return `${zeroPad(day)}-${zeroPad(month)}-${year} ${zeroPad(hour)}:${zeroPad(
    minute
  )}:${zeroPad(seconds)}`;
};

const Main = ({ activeNote, onUpdateNote, onUpdateFullText }) => {
  const [isViewingCreatedDate, setIsViewingCreatedDate] = useState(true);
  const [fullText, setFullText] = useState(activeNote?.fullText || "");
  useEffect(() => {
    setFullText(activeNote?.fullText);
  }, [activeNote?.fullText]);

  useEffect(() => {
    const onEditFullText = () => {
      if (isNil(fullText)) {
        return;
      }

      const { title, body } = extractTitleAndBody(fullText);
      if (title === activeNote?.title && body === activeNote?.body) {
        return;
      }

      onUpdateFullText({
        ...activeNote,
        title,
        body
      });
    };
    const onEditField = () => {
      if (isNil(fullText)) {
        return;
      }

      const { title, body } = extractTitleAndBody(fullText);
      if (title === activeNote?.title && body === activeNote?.body) {
        return;
      }

      onUpdateNote({
        ...activeNote,
        title,
        body
      });
    };

    onEditFullText();
    const timeoutId = setTimeout(onEditField, 300);
    return () => clearTimeout(timeoutId);
  }, [fullText]);

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        {/* TODO: Implement BOLD TEXT for the first line (aka title) of textarea */}
        <textarea
          className="note-textarea"
          id="body"
          placeholder="Write your note here..."
          value={fullText}
          onChange={e => setFullText(e.target.value)}
        />
      </div>
      <div className="app-main-note-preview">
        <div
          className="preview-title"
          onClick={() => setIsViewingCreatedDate(v => !v)}
        >
          {isViewingCreatedDate
            ? `Created Date: ${formatDate(activeNote.createdAt)}`
            : `Last Modified: ${formatDate(activeNote.updatedAt)}`}
        </div>
        <h1 className="preview-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;
