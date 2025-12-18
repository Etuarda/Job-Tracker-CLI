const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET não definido no ambiente');
}

export const jwtConfig = {
  secret,
  expiresIn: '1d',
};
