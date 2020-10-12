import { Document } from "mongoose";

export interface Note extends Document {
  noteId: number;
  title: string;
  description: string;
  lastUpdate: number;
}
