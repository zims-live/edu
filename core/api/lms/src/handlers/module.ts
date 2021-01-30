import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';

export const createModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, schoolid, grade = 0 } = req.body;
    const query =
      'INSERT INTO Modules(name, schoolid, grade) VALUES ($1, $2, $3)';
    await pool.query(query, [name, schoolid, grade]);
    res.status(200).send('Created module');
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};

export const listEnrolledModules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;
    const query = 'SELECT DISTINCT name FROM Enrolls WHERE userid = $1';
    const results: QueryResult = await pool.query(query, [userId]);
    if (results.rowCount !== 0) {
      res.status(200).json(results.rows);
    } else {
      res.status(403).send('No modules enrolled');
    }
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};

export const listTeachModules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;
    const query = 'SELECT DISTINCT name FROM Teaches WHERE userid = $1';
    const results: QueryResult = await pool.query(query, [userId]);
    if (results.rowCount !== 0) {
      res.status(200).json(results.rows);
    } else {
      res.status(403).send('No modules enrolled');
    }
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};

export const enrollModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, moduleId } = req.body;
    const query = 'INSERT INTO Enrolls(userid, moduleid) VALUES ($1, $2)';
    await pool.query(query, [userId, moduleId]);
    res.status(200).send('Enrolled module');
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};

export const teachModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, moduleId } = req.body;
    const query = 'INSERT INTO Teaches(userid, moduleid) VALUES ($1, $2)';
    await pool.query(query, [userId, moduleId]);
    res.status(200).send('Enrolled module');
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};
