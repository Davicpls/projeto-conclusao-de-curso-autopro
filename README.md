# AutoPro

Projeto monorepo com:

* **Backend:** Node.js + Express
* **Frontend:** React + Vite
* **Ambiente:** Docker + Docker Compose

---

# Estrutura do projeto

```text
pcc/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── index.js
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── src/
│   └── index.html
│
└── docker-compose.yml
```

---

# Pré-requisitos

Instalar:

## 1. Docker Desktop

Baixar e instalar:

[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Durante a instalação:

* manter **WSL 2 based engine** habilitado

Após instalar:

* abrir o Docker Desktop
* esperar aparecer:

```text
Docker Desktop is running
```

---

## 2. VSCode (opcional, recomendado)

[https://code.visualstudio.com/](https://code.visualstudio.com/)

---

# Clonar ou abrir o projeto

```powershell
cd C:\Users\SEU_USUARIO\Desktop
```

Se ainda não existir:

```powershell
mkdir pcc
cd pcc
```

Abrir no VSCode:

```powershell
code .
```

Importante:

Abrir somente a pasta do projeto:

```text
Desktop/pcc
```

Nunca abrir o Desktop inteiro.

---

# Backend

## Criar pasta

```powershell
mkdir backend
cd backend
```

---

## Inicializar package.json

```powershell
docker run --rm -it -v ${PWD}:/app -w /app node:25.9.0 npm init -y
```

---

## Instalar dependências

```powershell
docker run --rm -it -v ${PWD}:/app -w /app node:25.9.0 npm install express cors dotenv
```

---

## Instalar nodemon

```powershell
docker run --rm -it -v ${PWD}:/app -w /app node:25.9.0 npm install -D nodemon
```

---

## Criar index.js

```js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API AutoPro rodando" });
});

app.get("/produtos", (req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## Ajustar package.json

Adicionar:

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

---

## Criar backend/.dockerignore

```text
node_modules
npm-debug.log
Dockerfile
.dockerignore
```

---

## Criar backend/Dockerfile

```dockerfile
FROM node:25.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

---

# Frontend

## Voltar para raiz

```powershell
cd ..
mkdir frontend
cd frontend
```

---

## Criar projeto React + Vite

```powershell
docker run --rm -it -v ${PWD}:/app -w /app node:25.9.0 npm create vite@latest . -- --template react
```

Isso irá criar:

* package.json
* src/
* index.html
* vite.config.js

---

## Criar frontend/.dockerignore

```text
node_modules
npm-debug.log
Dockerfile
.dockerignore
dist
```

---

## Criar frontend/Dockerfile

```dockerfile
FROM node:25.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

# docker-compose.yml

Criar na raiz do projeto:

```yaml
version: "3.9"

services:
  backend:
    build: ./backend
    container_name: pcc_backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    container_name: pcc_frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev -- --host
```

---

# Rodar o projeto

Na raiz:

```powershell
cd C:\Users\SEU_USUARIO\Desktop\pcc

docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3001
```

Swagger:

```text
http://localhost:3001/api-docs
```

Arquivo OpenAPI em JSON:

```text
http://localhost:3001/swagger.json
```

---

# Parar containers

```powershell
docker compose down
```

---

# Problemas comuns

## Erro: package.json não encontrado

Significa que o frontend ainda não foi criado.

Rodar novamente:

```powershell
cd frontend

docker run --rm -it -v ${PWD}:/app -w /app node:25.9.0 npm create vite@latest . -- --template react
```

---

## Erro: archive/tar unknown file mode

Normalmente causado por node_modules no Windows.

Apagar:

```powershell
Remove-Item -Recurse -Force .\backend\node_modules
Remove-Item -Recurse -Force .\frontend\node_modules
```

E rodar novamente.

---

## Erro: dockerDesktopLinuxEngine

Docker Desktop não está rodando.

Abrir o Docker Desktop e aguardar inicialização completa.

---

# Git

Inicializar Git somente dentro da pasta do projeto:

```powershell
cd C:\Users\SEU_USUARIO\Desktop\pcc
git init
```

Nunca iniciar Git no Desktop inteiro.

---
