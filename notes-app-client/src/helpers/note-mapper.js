export const mapNote = note => {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    fullText: note.title + "\n" + note.body,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt)
  };
};
