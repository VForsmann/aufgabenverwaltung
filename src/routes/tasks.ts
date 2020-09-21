import express from 'express';
import { MongoGenericDAO } from '../models/mongo-generic.dao';
import { Task } from '../models/task';

const router = express.Router();

router.get('/', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  try {
    const tasks = await taskDAO.findAll();
    res.render('tasks', { tasks });
  } catch(error) {
    console.log("DAO ERROR FINDALL");
  }
});

router.post('/', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const task: Partial<Task> = { title: req.body.title, status: 'open' };
  await taskDAO.create(task);
  res.redirect('/tasks');
});

router.delete('/:id', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const id = req.params.id;
  await taskDAO.delete(id);
  res.status(200).end()
});

router.patch('/:id', async (req, res) => {
  const taskDAO: MongoGenericDAO<Task> = req.app.locals.taskDAO;
  const task: Partial<Task> = { id: req.params.id, status: req.body.status };
  await taskDAO.update(task);
  res.status(200).end()
});

export default router;
