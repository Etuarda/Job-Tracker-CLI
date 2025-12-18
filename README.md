# Job Tracker — Full Stack (Frontend + Backend)

Aplicação full stack para organizar candidaturas, com autenticação **JWT**, persistência em **MongoDB**, e frontend acessível com **VLibras**.

## Stack
- **Frontend:** Vite + HTML/CSS/JS (SPA com hash routing)
- **Backend:** Node.js + Express + TypeScript (MVC)
- **Auth:** bcrypt + JWT
- **DB:** MongoDB (Mongoose)
- **Acessibilidade:** Skip link, foco visível, labels, aria, VLibras

---

## Como rodar localmente (sem Docker)

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

A API sobe em: `http://localhost:3333`  
Healthcheck: `http://localhost:3333/health`

### 2) Frontend
Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abra: `http://localhost:5173`

---

## Como usar
1. Acesse `/login` e clique em **Criar conta**
2. Faça login
3. No Dashboard, adicione candidaturas, altere status e exclua

---

## Rodar com Docker (recomendado para ambiente consistente)

```bash
docker compose up --build
```

- Frontend (Nginx): `http://localhost:8080`
- Backend: `http://localhost:3333`
- MongoDB: `mongodb://localhost:27017`

> Observação: o frontend no Docker usa build estático (Nginx). Para apontar para outra API em produção, você deve buildar com `VITE_API_URL` correto.
>
> Exemplo:
> ```bash
> cd frontend
> VITE_API_URL=https://sua-api.com npm run build
> ```

---

## Deploy (produção)

### Backend
Sugestão: DigitalOcean App Platform / Render / Railway.
Configure variáveis:
- `MONGO_URL`
- `JWT_SECRET`
- `CORS_ORIGIN` (URL do seu frontend)

### Frontend
Vercel / Netlify:
- Build command: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://sua-api.com`

---

## Endpoints principais

### Auth
- `POST /auth/register` — cria usuário
- `POST /auth/login` — retorna JWT
- `GET /auth/me` — retorna usuário (protegido)

### Applications (protegido)
- `GET /applications` — lista
- `POST /applications` — cria
- `PATCH /applications/:id/status` — atualiza status
- `DELETE /applications/:id` — remove

---

## Organização do código (Backend)
- `models/` — schemas Mongoose
- `controllers/` — regras HTTP
- `routes/` — mapeamento de rotas
- `middlewares/` — auth, errors

---

## Licença
MIT
