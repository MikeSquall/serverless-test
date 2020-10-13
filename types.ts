import { Document } from "mongoose";

export interface Note extends Document {
  noteId: number;
  title: string;
  description: string;
  lastUpdate: number;
}

export interface CallbackResponse {
  headers: { [header: string]: string };
  statusCode: number;
  body: string;
  isBase64Encoded: boolean;
}
