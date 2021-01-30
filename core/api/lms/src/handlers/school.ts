import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';

export const createSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, country, city } = req.body;
    const query =
      'INSERT INTO Schools(name, country, city) VALUES ($1, $2, $3)';
    await pool.query(query, [name, country, city]);
    res.status(200).send('Created school');
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};

export const listSchools = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = 'SELECT * FROM Schools';
    const results: QueryResult = await pool.query(query);
    if (results.rowCount !== 0) {
      res.status(200).json(results.rows);
    } else {
      res.status(403).send('No schools found');
    }
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};
