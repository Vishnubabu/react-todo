/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import only from '../utils/only.js';
const Todo = mongoose.model('Todo');
const assign = Object.assign;

/**
 * List todos
 */
export async function list(req, res) {
  try {
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const options = {
      page: page
    };

    res.send(await Todo.list(options));
  } catch (e) {
    console.error(e);
    res.send([]);
  }
}

/**
 * Create todo
 */
export async function create(req, res) {
  try {
    const todo = new Todo(only(req.body, 'title'));
    await todo.save();
    res.send(todo);
  } catch (e) {
    console.error(e);
    res.status(422).send({ status: 'failed' });
  }
}


/**
 * Update todo
 */
export async function update(req, res) {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    assign(todo, only(req.body, 'title', 'checked'));
    await todo.save();
    res.send({ status: 'success' });
  } catch (e) {
    console.error(e);
    res.status(422).send({ status: 'failed' });
  }
}

/**
 * Delete todo
 */
export async function destroy(req, res) {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.send({ status: 'success' });
  } catch (e) {
    console.error(e);
    res.status(422).send({ status: 'failed' });
  }
}
