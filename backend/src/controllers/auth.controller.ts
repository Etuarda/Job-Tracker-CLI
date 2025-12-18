import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import User from '../models/User.js';
import { jwtConfig } from '../config/jwt.js';

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }
  if (!isEmail(String(email))) {
    return res.status(400).json({ message: 'E-mail inválido.' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado.' });

  const hash = await bcrypt.hash(String(password), 10);

  await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password: hash
  });

  return res.status(201).json({ message: 'Usuário criado com sucesso.' });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const valid = await bcrypt.compare(String(password), String(user.password));
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const token = jwt.sign({ id: String(user._id) }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId).select('_id name email createdAt');
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  return res.json({ user });
}
