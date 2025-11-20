import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct, getEnabledProducts } from '../controllers/productController';
import { validateProductCreate, validateProductUpdate } from '../middlewares/validateProduct';

const router = Router();

router.post('/', validateProductCreate, createProduct);
router.put('/:id', validateProductUpdate, updateProduct);
router.delete('/:id', deleteProduct);
router.get('/enabled', getEnabledProducts);

export default router;
