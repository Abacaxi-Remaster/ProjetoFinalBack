"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./database");
var connection = (0, database_1.criarConexao)();
// Porta do servidor
const PORT = 3000;
// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';
// App Express
const app = (0, express_1.default)();
// Faz com que o body da requisição http vire um json
app.use(body_parser_1.default.json());
// Endpoint raiz
app.get('/', (req, res) => {
    let sql = "SELECT * FROM alunos";
    connection.query(sql, function (err, results) {
        if (err)
            throw err;
        res.send(results);
    });
});
app.post('/login', (req, res) => {
    let comando = "SELECT * FROM " + req.body.usuario + " where email = \"" + req.body.email + "\" and senha = \"" + req.body.senha + "\"";
    console.log(comando);
    connection.query(comando, function (err, results) {
        if (err)
            throw err;
        console.log(results);
        res.send(results);
    });
});
app.get('/cadastro', (req, res) => {
    var body = req.body;
    var comando;
    if (body.usuario == "alunos")
        comando = (0, database_1.criaAluno)(body);
    else if (body.usuario == "empresas")
        comando = (0, database_1.criaEmpresas)(body);
    else if (body.usuario == "professores")
        comando = (0, database_1.criaProfessores)(body);
    else if (body.usuario == "adms")
        comando = (0, database_1.criaAdms)(body);
    connection.query(comando, function (err, results) {
        if (err)
            throw err;
        return results;
    });
});
// Cors
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000']
}));
// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404);
});
// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});
