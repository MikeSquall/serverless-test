import { Schema, model } from 'mongoose';
import { Note } from '../types';

const NoteSchema = new Schema({
  noteId: Number,
  title: String,
  description: String,
  lastUpdate: Number,
});

export default model<Note>('Note', NoteSchema);
