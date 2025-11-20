import pool from '../config/db';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  is_enabled?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const ProductModel = {
  async create(product: Product): Promise<Product> {
    const { name, description, price, stock, is_enabled } = product;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, is_enabled) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock ?? 0, is_enabled ?? true]
    );
    return result.rows[0];
  },

  async findById(id: number): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount! > 0;
  },

  async findAllEnabled(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products WHERE is_enabled = true ORDER BY created_at DESC');
    return result.rows;
  }
};
