import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTAS_FILE = path.join(__dirname, 'notas.json');

app.use(cors());
app.use(express.json());

// Funções auxiliares para ler e salvar o arquivo JSON
function lerNotas() {
    if (!fs.existsSync(NOTAS_FILE)) {
        fs.writeFileSync(NOTAS_FILE, JSON.stringify([], null, 2));
    }
    const conteudo = fs.readFileSync(NOTAS_FILE, 'utf-8');
    return JSON.parse(conteudo);
}

function salvarNotas(notas) {
    fs.writeFileSync(NOTAS_FILE, JSON.stringify(notas, null, 2));
}

function gerarId() {
    return Date.now().toString();
}

// GET / — informações da API
app.get('/', (req, res) => {
    res.json({
        name: 'API de Notas',
        status: 'online',
        endpoints: {
            listarNotas:  'GET    /notas',
            criarNota:    'POST   /notas',
            editarNota:   'PUT    /notas/:id',
            excluirNota:  'DELETE /notas/:id'
        }
    });
});

// GET /notas — listar todas as notas
app.get('/notas', (req, res) => {
    const notas = lerNotas();
    res.status(200).json({
        total: notas.length,
        notas
    });
});

// POST /notas — criar uma nota
app.post('/notas', (req, res) => {
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
        return res.status(400).json({
            error: 'Os campos "titulo" e "conteudo" são obrigatórios.'
        });
    }

    const notas = lerNotas();
    const novaNota = {
        id: gerarId(),
        titulo,
        conteudo,
        criadoEm: new Date().toISOString()
    };

    notas.push(novaNota);
    salvarNotas(notas);

    return res.status(201).json({
        mensagem: 'Nota criada com sucesso.',
        nota: novaNota
    });
});

// PUT /notas/:id — editar uma nota existente
app.put('/notas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
        return res.status(400).json({
            error: 'Os campos "titulo" e "conteudo" são obrigatórios.'
        });
    }

    const notas = lerNotas();
    const index = notas.findIndex((n) => n.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Nota não encontrada.'
        });
    }

    notas[index] = {
        ...notas[index],
        titulo,
        conteudo,
        atualizadoEm: new Date().toISOString()
    };

    salvarNotas(notas);

    return res.status(200).json({
        mensagem: 'Nota atualizada com sucesso.',
        nota: notas[index]
    });
});

// DELETE /notas/:id — excluir uma nota
app.delete('/notas/:id', (req, res) => {
    const { id } = req.params;
    const notas = lerNotas();
    const index = notas.findIndex((n) => n.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Nota não encontrada.'
        });
    }

    const notaRemovida = notas.splice(index, 1)[0];
    salvarNotas(notas);

    return res.status(200).json({
        mensagem: 'Nota excluída com sucesso.',
        nota: notaRemovida
    });
});

app.listen(PORT, () => {
    console.log(`API de Notas rodando na porta ${PORT}`);
});
