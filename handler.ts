import { Handler, Context } from 'aws-lambda'
import DbService from './services/Database';
import NoteService from './services/Note';

// require('dotenv').config({ path: __dirname + '../.env'});

export const hello: Handler = async (event: any, _: Context, callback: any) => {
  const response = {
    statusCode: 200,
    body: {
      message: 'My "hello" function is executed correctly via Serverless and it is nice !',
      input: JSON.stringify({ event}),
    },
  };

  callback(null, response);
}

export const create: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    callback(null, {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Unable to create note: db connection failed', data: e.message },
    });
  }
  const { title, description } = JSON.parse(event.body);
  const note = await NoteService.create({ title, description });

  if (!note) {
    callback(null, {
      statusCode: 500,
      headers: {'Content-Type': 'application/json'},
      body: {message: 'Unable to create note: server error'},
    });
  }

  callback(null, {
    statusCode: 201,
    body: JSON.stringify({ note }),
  });
};

export const getOne: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    callback(null, {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Unable to get note: db connection failed', data: e.message },
    });
  }
  const id = event.pathParameters.id;
  const note = await NoteService.getOne({ id });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ note }),
  });
};

export const getAll: Handler = async (_: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    callback(null, {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Unable to get notes: db connection failed', data: e.message },
    });
  }
  const notes = await NoteService.getAll({});

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ notes }),
  });
};

export const update: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    callback(null, {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Unable to update note: db connection failed', data: e.message },
    });
  }
  const id = event.pathParameters.id;
  const { title, description } = JSON.parse(event.body);

  const note = await NoteService.update({ id, title: title, description });

  if (!!note) { callback(null, { statusCode: 500, body: JSON.stringify({note}) }); }

  callback(null, { statusCode: 200 });
};

export const deleteOne: Handler = async (event: any, context: Context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await DbService.connect();
  } catch (e) {
    callback(null, {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Unable to delete note: db connection failed', data: e.message },
    });
  }
  const id = event.pathParameters.id;
  const note = await NoteService.delete({ id });

  if (!!note) { callback(null, { statusCode: 500, body: JSON.stringify({note}) }); }
  callback(null, { statusCode: 200 });
};
