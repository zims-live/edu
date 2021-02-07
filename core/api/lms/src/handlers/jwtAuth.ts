import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  try {
    let idToken: string = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      res.status(402).json({ error: 'Unauthorized' });
    }
    const secret: string = process.env.JWT_SECRET ?? 'examplesecret';
    const payload = jwt.verify(idToken, secret);
    req.body.user = payload;
    next();
  } catch (error) {
    res.status(402).json('Token incorrect');
  }
};
