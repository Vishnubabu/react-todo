import express from 'express';
import { list, create, destroy, update } from '../controllers/todo.js';
const router = express.Router();

router.get('/', list);
router.post('/', create);
router.delete('/:id', destroy);
router.put('/:id', update);

export default router;
