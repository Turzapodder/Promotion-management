import pool from '../config/database';

export interface Promotion {
  id?: number;
  title: string;
  description?: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  banner_url?: string;
  enabled?: boolean;
  discount_type?: 'percentage' | 'fixed' | 'weighted';
  percentage_rate?: number; // for percentage
  fixed_amount?: number; // for fixed
  created_at?: Date;
  updated_at?: Date;
}

export const PromotionModel = {
  async create(promo: Promotion): Promise<Promotion> {
    const { title, description, start_date, end_date, banner_url, enabled, discount_type, percentage_rate, fixed_amount } = promo;
    const result = await pool.query(
      `INSERT INTO promotions (title, description, start_date, end_date, banner_url, enabled, discount_type, percentage_rate, fixed_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description ?? null, start_date, end_date, banner_url ?? null, enabled ?? true, discount_type ?? null, percentage_rate ?? null, fixed_amount ?? null]
    );
    return result.rows[0];
  },

  async findAll(): Promise<Promotion[]> {
    const result = await pool.query('SELECT * FROM promotions ORDER BY created_at DESC');
    return result.rows;
  },

  async findAllEnabled(): Promise<Promotion[]> {
    const result = await pool.query('SELECT * FROM promotions WHERE enabled = true ORDER BY created_at DESC');
    return result.rows;
  },

  async update(id: number, updates: Partial<Promotion>): Promise<Promotion | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const allowed: (keyof Promotion)[] = ['title', 'start_date', 'end_date'];
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && allowed.includes(key as keyof Promotion)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE promotions SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async setEnabled(id: number, enabled: boolean): Promise<Promotion | null> {
    const result = await pool.query(
      `UPDATE promotions SET enabled = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [enabled, id]
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM promotions WHERE id = $1', [id]);
    return result.rowCount! > 0;
  },
};