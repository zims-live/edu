import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../db';

export const createModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, schoolid, startDate, endDate, grade = 1 } = req.body;
    const query =
      'INSERT INTO LMS.Modules(name, schoolid, startDate, endDate, grade) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [name, schoolid, startDate, endDate, grade]);
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
    const { id } = req.body.user;
    const query = 'SELECT DISTINCT M.* FROM LMS.Modules M NATURAL JOIN LMS.Enrolls E WHERE E.userid = $1';
    const results: QueryResult = await pool.query(query, [id]);
    if (results.rowCount !== 0) {
      res.status(200).json(results.rows);
    } else {
      res.status(200).send('No modules enrolled');
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
    const { id } = req.body.user;
    const query = 'SELECT DISTINCT M.* FROM LMS.Modules M NATURAL JOIN LMS.Teaches T WHERE T.userid = $1';
    const results: QueryResult = await pool.query(query, [id]);
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
    const { id } = req.body.user;
    const { moduleId } = req.body;
    const query = 'INSERT INTO LMS.Enrolls(userid, moduleid) VALUES ($1, $2)';
    await pool.query(query, [id, moduleId]);
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
    const { id } = req.body.user;
    const { moduleId } = req.body;
    const query = 'INSERT INTO LMS.Teaches(userid, moduleid) VALUES ($1, $2)';
    await pool.query(query, [id, moduleId]);
    res.status(200).send('Enrolled module');
  } catch (error) {
    res.status(403).send('Something went wrong..');
  }
};
