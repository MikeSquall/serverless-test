import { Handler, Context } from 'aws-lambda'
import DbService from './services/Database';
import NoteService from './services/Note';
import { CallbackResponse } from './types';

const headers = { 'Content-Type': 'application/json' };
const isBase64Encoded = false;

export const hello: Handler = async (event: any, _: Context, callback: any) => {
  const response: CallbackResponse = {
    headers,
    isBase64Encoded,
    statusCode: 200,
    body: JSON.stringify({
      message: 'My "hello" function is executed correctly via Serverless and it is nice !',
      input: { event },
    }),
  };

  callback(null, response);
}

export const create: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ message: 'Unable to create note: db connection failed', data: e.message }),
    }
    callback(null, response);
  }
  const { title, description } = JSON.parse(event.body);
  const note = await NoteService.create({ title, description });

  if (!note) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: 500,
      body: JSON.stringify({message: 'Unable to create note: server error'}),
    };
    callback(null, response);
  }

  const response: CallbackResponse = {
    headers,
    isBase64Encoded,
    statusCode: 201,
    body: JSON.stringify({ note }),
  };
  callback(null, response);
};

export const getOne: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ message: 'Unable to get note: db connection failed', data: e.message }),
    };
    callback(null, response);
  }
  const id = event.pathParameters.id;
  const note = await NoteService.getOne({ id });

  const response: CallbackResponse = {
    headers,
    isBase64Encoded,
    statusCode: 200,
    body: JSON.stringify({ note }),
  };
  callback(null, response);
};

export const getAll: Handler = async (_: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ message: 'Unable to get notes: db connection failed', data: e.message }),
    };
    callback(null, response);
  }
  const notes = await NoteService.getAll({});
  const response: CallbackResponse = {
    headers,
    isBase64Encoded,
    statusCode: 200,
    body: JSON.stringify({ notes }),
  }

  callback(null, response);
};

export const update: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ message: 'Unable to update note: db connection failed', data: e.message }),
    };
    callback(null, response);
  }
  const id = event.pathParameters.id;
  const { title, description } = JSON.parse(event.body);

  const note = await NoteService.update({ id, title: title, description });

  if (!!note) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: 500,
      body: JSON.stringify({note}),
    };
    callback(null, response);
  }

  callback(null, { statusCode: 200 });
};

export const deleteOne: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ message: 'Unable to delete note: db connection failed', data: e.message }),
    };
    callback(null, response);
  }
  const id = event.pathParameters.id;
  const note = await NoteService.delete({ id });

  if (!!note) {
    const response: CallbackResponse = {
      headers,
      isBase64Encoded,
      statusCode: 500,
      body: JSON.stringify({note}) };
    callback(null, response);
  }

  callback(null, { statusCode: 200 });
};
