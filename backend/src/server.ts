import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT || 3333);
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('MONGO_URL não configurado.');
  process.exit(1);
}

connectDB(mongoUrl)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[api] http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[db] failed', err);
    process.exit(1);
  });
