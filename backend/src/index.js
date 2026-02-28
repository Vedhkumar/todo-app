import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todosRouter from './routes/todos.js';
import { migrate } from './migrate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todosRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
