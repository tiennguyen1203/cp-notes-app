export const mapNote = note => {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    fullText: note.body ? note.title + "\n" + note.body : note.title,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt)
  };
};
