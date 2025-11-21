import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct, getEnabledProducts } from '../controllers/productController';
import { validateProductCreate, validateProductUpdate } from '../middlewares/validateProduct';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, validateProductCreate, createProduct);
router.put('/:id', authenticate, validateProductUpdate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.get('/enabled', authenticate, getEnabledProducts);

export default router;
