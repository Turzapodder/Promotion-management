import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    res.status(500).json({ success: false, message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.update(parseInt(req.params.id), req.body);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    res.status(500).json({ success: false, message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await ProductModel.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    res.status(500).json({ success: false, message });
  }
};

export const getEnabledProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAllEnabled();
    res.json({ success: true, message: 'Products fetched', data: products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    res.status(500).json({ success: false, message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.findAll();
    res.json({ success: true, message: 'Products fetched', data: products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    res.status(500).json({ success: false, message });
  }
};
