import type { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response) {
  return res.status(404).json({ message: 'Rota não encontrada.' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[error]', err);
  const status = err?.statusCode ?? 500;
  const message = err?.message ?? 'Erro interno do servidor.';
  return res.status(status).json({ message });
}
