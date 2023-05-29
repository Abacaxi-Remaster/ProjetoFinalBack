import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { criaAluno, criarConexao, criaEmpresas, criaProfessores, criaTreinamentos } from './database';
import { readJSON } from './leitordeJSON';


var connection = criarConexao();

// Porta do servidor
const PORT = 8000
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
    var body = req.body;
    console.log(body);
    let comando = "SELECT * FROM " + body.usuario + " where email = \"" + body.email + "\" and senha = \"" + body.senha + "\"";
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err) throw err;
        console.log(results[0].id); //precisa de [0], pq o "results" devolve uma array com todos os "rows" encontrados em forma de objeto, 
        //como sempre sera apenas 1 usuario ou nenhum, usamos o index 0, para acessar o objeto enviado.
        res.send(JSON.stringify(results[0])); // passamos o objeto para JSON e devolvemos.
    });    
})

//Sucesso
app.post('/cadastro', (req, res) => {
    var body = req.body;
    var comando : any;
    if(body.usuario == "alunos")
        comando = criaAluno(body);
    else if(body.usuario == "empresas")
        comando = criaEmpresas(body);
    else if(body.usuario == "professores")
        comando = criaProfessores(body);
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err) throw err;
        res.send(results);
    });   
})
app.post('/treinamentos', (req,res)=>{
var body = req.body;
var comando : any;
comando = criaTreinamentos(body);
console.log(comando);
connection.query(comando,function(err, results){
    if (err)throw err;
    res.send(results);
})


});
// Cors
app.use(cors({
    origin: ['http://localhost:8000']
}))
// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404)
})
// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`)
})