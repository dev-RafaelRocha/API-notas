# API de Notas

API REST desenvolvida com Node.js e Express para gerenciamento de notas com operações CRUD completas. Os dados são armazenados em arquivo JSON.

## Links

- **API:** https://api-notas-yd41.onrender.com
- **Frontend:** https://frontend-notas-mu.vercel.app

## Tecnologias

- Node.js
- Express
- CORS

## 📋 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/notas` | Lista todas as notas |
| POST | `/notas` | Cria uma nova nota |
| PUT | `/notas/:id` | Edita uma nota existente |
| DELETE | `/notas/:id` | Exclui uma nota |

## Como rodar localmente

```bash
npm install
npm start
```

Acesse: http://localhost:3000

## Exemplo de body (POST e PUT)

```json
{
  "titulo": "Minha nota",
  "conteudo": "Conteúdo da nota aqui"
}
```
