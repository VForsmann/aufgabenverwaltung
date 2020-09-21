import express, { Express } from 'express';
import exphbs from 'express-handlebars';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import tasks from './routes/tasks';
import users from './routes/users';
import startDB from './db';
import cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';

const port = 3000;

function configureApp(app: Express) {
  const engineConfig = {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main'
  };
  app.engine('hbs', exphbs(engineConfig));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.get('/', (_, res) => res.redirect('/tasks') );
  app.use('/users', users);
  app.use((req, res, next) => {
    const token = req.cookies['jwt-token'] || '';
    try {
      res.locals.user = jwt.verify(token, 'MYSECRET');
      next();
    } catch (error) {
      res.redirect('/users/sign-in');
    }
  });
  app.use('/tasks', tasks);

}

async function start() {
  const app = express();

  configureApp(app);
  await startDB(app);
  startHttpServer(app);
}

function startHttpServer(app: Express) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
