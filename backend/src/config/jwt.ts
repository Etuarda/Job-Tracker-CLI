import type { SignOptions, Secret } from 'jsonwebtoken';

export const jwtConfig: {
  secret: Secret;
  expiresIn: SignOptions['expiresIn'];
} = {
  secret: process.env.JWT_SECRET as Secret,
  expiresIn: '7d'
};
