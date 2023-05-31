import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { criaAluno, criarConexao, criaEmpresas, criaMentores, criaTreinamentos} from './database';


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
//Sucesso 
app.post('/login', (req, res) => {
    var body = req.body;
    console.log(body);
    let comando = "SELECT * FROM " + body.usuario + " where email = \"" + body.email + "\" and senha = \"" + body.senha + "\"";
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        //precisa de [0], pq o "results" devolve uma array com todos os "rows" encontrados em forma de objeto, 
        //como sempre sera apenas 1 usuario ou nenhum, usamos o index 0, para acessar o objeto enviado.
        else if (results[0] != null)
        {
            res.status(200); 
            console.log(res.statusCode); 
            console.log(results.length);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results[0])); // passamos o objeto para JSON e devolvemos.
        }
        else
        {            
            res.set('Content-Type', 'application/json');
            res.status(204).send("Usuário não encontrado, confira senha e email!");
        }
    });    
})
//Sucesso       
app.post('/cadastro', (req, res) => {
    var body = req.body;
    var comando : any;

    // analisa qual usuario sera criado
    switch(body.usuario)
    {
        case "alunos": 
            comando = criaAluno(body);
        break;
        case "empresas":         
            comando = criaEmpresas(body);
        break;
        case "mentores": 
            comando = criaMentores(body);   
        break; 
    }
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        else if(results.insertId != 0)
        {
            res.status(200); 
            console.log(res.statusCode); 
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
        console.log(results.insertId);
        res.send(results);
    });   
})

//Base que vou usar para fazer o Treinamento
app.post('/treinamentos', (req, res) => {
    var body = req.body;
    console.log(body);
    var comando = criaTreinamentos(body);
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err) throw err;
        console.log(results.insertId); // da no console o numero de elementos passados 
        res.send(JSON.stringify(results)); 
    });    
})

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