import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let isConnected: number;

const gracefulExit = () => {
  mongoose.connection.close(() => {
    process.exit(0);
  }).then(() => {
    console.warn('Mongoose default connection with DB: disconnected through app interruption (SIGINT/SIGTERM)');
  });
};

export default {
  connect: async () => {
    if (!!isConnected) {
      console.log('--> using existing db connection');
    }
    // Connection fails
    mongoose.connection.on('error', (err) => {
      console.error(`Failed to connect to DB on startup: ${err.message}`);
    });
    // Disconnection
    mongoose.connection.on('disconnected', () => {
      console.error(`Mongoose default connection to DB: disconnected`);
    });
    // Close connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
    // Connect
    return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
      .then(db => {
        isConnected = db.connections[0].readyState;
        console.log(`--> using new db connection | isConnected: ${isConnected}`);
      });
  },
}
