import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import type { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) return res.status(401).json({ message: 'Token ausente.' });

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}
