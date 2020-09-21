import { MongoClient } from 'mongodb';
import { Express } from 'express';
import { MongoGenericDAO } from './models/mongo-generic.dao';
import { Task } from './models/task';
import { User } from './models/user';

export default async function startDB(app: Express) {
  return new Promise((resolve, reject) => {
    const url = 'mongodb://localhost:27017';
    const options = {
      useNewUrlParser: true,
      auth: { user: 'taskman', password: 'wifhm' },
      authSource: 'taskman'
    };
  
    MongoClient.connect(url, options, (err, client) => {
      if (err) {
        console.log('Could not connect to MongoDB: ', err.stack);
        reject('MONGODB_CONNECTION_ERROR');
        process.exit(1);
      } else {
        const db = client.db('taskman');
        app.locals.taskDAO = new MongoGenericDAO<Task>(db, 'tasks');
        app.locals.userDAO = new MongoGenericDAO<User>(db, 'users');
        resolve('SUCCESS DB INIT');
      }
    });
  })
  
}
