import type { Request, Response } from 'express';
import Application from '../models/Application.js';

const VALID_STATUSES = ['Não Iniciado', 'Em Andamento', 'Aprovado', 'Reprovado'];

export async function list(req: Request, res: Response) {
  const apps = await Application.find({ userId: req.userId }).sort({ createdAt: -1 });
  return res.json(apps);
}

export async function create(req: Request, res: Response) {
  const { titulo, empresa, status } = req.body ?? {};

  if (!titulo || !empresa) {
    return res.status(400).json({ message: 'Título e Empresa são obrigatórios.' });
  }

  const normalizedStatus = status ? String(status) : 'Não Iniciado';
  if (!VALID_STATUSES.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  const app = await Application.create({
    titulo: String(titulo).trim(),
    empresa: String(empresa).trim(),
    status: normalizedStatus,
    userId: req.userId
  });

  return res.status(201).json(app);
}

export async function updateStatus(req: Request, res: Response) {
  const { status } = req.body ?? {};
  if (!VALID_STATUSES.includes(String(status))) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: String(status) },
    { new: true }
  );

  if (!app) return res.status(404).json({ message: 'Candidatura não encontrada.' });
  return res.json(app);
}

export async function remove(req: Request, res: Response) {
  const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: 'Candidatura não encontrada.' });
  return res.status(204).send();
}
