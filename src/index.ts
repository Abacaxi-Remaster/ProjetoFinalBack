import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { inserirAluno, criarConexao, inserirEmpresas, inserirMentores, inserirTreinamentos, inserirQuiz, inserirQuestao, pegaHistorico} from './database';


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
    connection.query(sql, function(err: any, results: any){
        if (err) throw err;
        res.send(results);
    });
})
//Sucesso 
app.post('/login', (req, res) => {
    let body = req.body;
    console.log(body);
    let comando = "SELECT * FROM " + body.usuario + " where email = \"" + body.email + "\" and senha = \"" + body.senha + "\"";
    console.log(comando);
    connection.query(comando, function(err: any, results: string | any[]){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("LOGIN_FAILED"); 
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
            res.status(204).send("USER_NOT_FOUND");
        }
    });    
})
//Sucesso       
app.post('/cadastro', (req, res) => {
    let body = req.body;
    let comando : any;

    // analisa qual usuario sera criado
    switch(body.usuario)
    {
        case "alunos": 
            comando = inserirAluno(body);
        break;
        case "empresas":         
            comando = inserirEmpresas(body);
        break;
        case "mentores": 
            comando = inserirMentores(body);   
        break; 
    }
    console.log(comando);
    connection.query(comando, function(err: any, results: any){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("REGISTER_FAILED"); 
        } 
        // else if(results[0].insertId != 0)
        // {
        //     res.status(200); 
        //     console.log(res.statusCode); 
        //     res.set('Content-Type', 'application/json');
        //     res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        // }
        //console.log(results.insertId);
        res.status(200); 
        res.send(JSON.stringify("REGISTER_SUCCESS"));
    });   
})

//Sucesso
app.post('/treinamentos', (req, res) => {
    let body = req.body;
    const dadosTreinamentos = inserirTreinamentos(body.treinamentos);
    console.log(dadosTreinamentos);
    connection.query(dadosTreinamentos[1], function(err: any, results: any){
        if (err) throw err; 
        console.log(results);
    }); 

    for(const quiz of body.quiz)
    {
        let dadosQuiz = inserirQuiz(dadosTreinamentos[0]);
        connection.query(dadosQuiz[1], function(err: any, results: any){
            if (err) throw err; 
            console.log(results);
        }); 
        for(const questao of quiz)
        {
            let dadosQuestao = inserirQuestao(questao, dadosQuiz[0]);
            console.log(dadosQuestao);
            console.log("\n");
            connection.query(dadosQuestao, function(err: any, results: any){
                if (err) throw err; 
                console.log(results);
            }); 
        }
    }
    res.status(200);
    res.send("Foi");
})

app.post('/historico_aluno', (req, res) => {
    let body = req.body;
    const dadosHistorico = pegaHistorico(body.id);
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function(err: any, results: any){
        if (err) throw err; 
        console.log(results);
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