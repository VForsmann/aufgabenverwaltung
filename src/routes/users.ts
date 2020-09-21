import express from 'express';
import { MongoGenericDAO } from '../models/mongo-generic.dao';
import { User } from '../models/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const COST = 10;
const router = express.Router();

router.get('/sign-in', (req, res) => {
  res.render('sign-in', {
    error: { invalidCredentials: req.query.err === 'ic' }
  });
});

router.post('/sign-in', async (req, res) => {
  const userDAO: MongoGenericDAO<User> = req.app.locals.userDAO;
  const user = await userDAO.findOne({ email: req.body.email })
  if (!user) {
    res.clearCookie('jwt-token');
    res.redirect('/users/sign-in');
  } else {
    const success = await bcrypt.compare(req.body.password, user.password);
    if (!success) {
      res.clearCookie('jwt-token');
      res.redirect('/users/sign-in');
    } else {
      const jwt = generateJWT(<User>{ name: user.name, id: user.id, email: user.email });
      res.cookie('jwt-token', jwt);
      res.redirect('/tasks');
    }

  }

});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/', async (req, res) => {
  const userDAO: MongoGenericDAO<User> = req.app.locals.userDAO;
  const hash = await bcrypt.hash(req.body.password, 10);
  let user: Partial<User> = { name: req.body.name, email: req.body.email, password: hash };
  user = await userDAO.create(user);
  const jwt = generateJWT(<User>{ name: user.name, id: user.id, email: user.email });
  res.cookie('jwt-token', jwt);
  res.redirect('/tasks');
});

function generateJWT(claim: { name: string, id: string, email: string }) {
  const token = jwt.sign(claim, 'MYSECRET', { algorithm: "HS256" })
  return token;
}


export default router;
