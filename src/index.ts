import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { criaAluno, criarConexao, criaEmpresas, criaProfessores } from './database';
import { readJSON } from './leitordeJSON';


var connection = criarConexao();

// Porta do servidor
const PORT = 3000
// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
// App Express
const app = express()
// Faz com que o body da requisição http vire um json
app.use(bodyParser.json());
// Endpoint raiz
app.get('/', (req, res) => {
    let sql = "SELECT * FROM alunos";
    connection.query(sql, function(err, results){
        if (err) throw err;
        res.send(results);
    });
})

app.post('/login', (req, res) => {
    let comando = "SELECT * FROM " + req.body.usuario + " where email = \"" + req.body.email + "\" and senha = \"" + req.body.senha + "\"";
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err) throw err;
        console.log(results);
        res.send(results);
    });    
})

app.get('/cadastro', (req, res) => {
    var body = req.body;
    var comando : any;
    if(body.usuario == "alunos")
        comando = criaAluno(body);
    else if(body.usuario == "empresas")
        comando = criaEmpresas(body);
    else if(body.usuario == "professores")
        comando = criaProfessores(body);
    connection.query(comando, function(err, results){
        if (err) throw err;
        return results;
    });   
})

// Cors
app.use(cors({
    origin: ['http://localhost:3000']
}))
// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404)
})
// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`)
})