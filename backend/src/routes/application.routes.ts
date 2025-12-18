import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { list, create, remove, updateStatus } from '../controllers/application.controller.js';

const router = Router();

router.use(auth);

router.get('/', list);
router.post('/', create);
router.patch('/:id/status', updateStatus);
router.delete('/:id', remove);

export default router;
