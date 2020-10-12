import { NoteModel } from '../models';

export default {
  create: async (r: { title: string, description: string }) => {
    const { title, description } = r;
    try {
      const note = await NoteModel.create({ noteId: Date.now(), title, description, lastUpdate: Date.now() });
      return { noteId: note.noteId, title: note.title, description: note.description, lastUpdate: note.lastUpdate };
    } catch (e) {
      console.error(e);
      return { code: e.code, message: e.message };
    }
  },
  getOne: async (r: { id: number }) => {
    const note = await NoteModel.findOne({ noteId: r.id });
    return !!note ? note : { code: 404, message: `No note found with id ${r.id}`};
  },
  getAll: async ({}) => {
    const notes = await NoteModel.find();
    return notes || { notes: [] };
  },
  update: async (r: { id: number, title: string, description: string }) => {
    const { id, title, description } = r;
    try {
      await NoteModel.findOneAndUpdate({ noteId: id }, { title, description, lastUpdate: Date.now() });
    } catch (e) {
      console.error(e);
      return { code: e.code, message: `${e.message}` };
    }
  },
  delete: async (r: { id: number}) => {
    const note = await NoteModel.findOne({ noteId: r.id });
    try {
      await NoteModel.findByIdAndRemove(note!._id);
    } catch (e) {
      console.error(e);
      return { code: e.code, message: `${e.message}` };
    }
  },
}
