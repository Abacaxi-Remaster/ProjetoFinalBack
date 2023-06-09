import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { inserirAluno, criarConexao, inserirEmpresas, inserirMentores, inserirTreinamentos, inserirQuiz, inserirQuestao, pegaHistoricoAlunos, criaVagasdeEmprego, pegaVagasdeEmprego, inscricaoAlunosVagas, pegaAlunosVagas, pegaVagasdeEmpregoAluno} from './database';



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
            console.log(results[0]);
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
        else
        {
            res.status(200); 
            res.send(JSON.stringify("Deu certo!"));
        }
        // else if(results[0].insertId != 0)
        // {
        //     res.status(200); 
        //     console.log(res.statusCode); 
        //     res.set('Content-Type', 'application/json');
        //     res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        // }
        //console.log(results.insertId);
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
// array 
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

/// prototipo do get historico_alunos
app.get('/historico_alunos', (req, res) => {
    let body = req.body;
    const dadosHistorico = pegaHistoricoAlunos(body.id_aluno);
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function(err: any, results: any){
        if (err) throw err; 
        console.log(results.body);
    }); 
})

//Sucesso 
app.post('/vagas/cadastro', (req, res) => {
    let body = req.body;
    console.log(body);
    let comando = criaVagasdeEmprego(body);
    console.log(comando);
    connection.query(comando, function(err, results){
        console.log(err);
        console.log(results);
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        else
        {
            res.status(200); 
            res.send(JSON.stringify("Deu certo!"));
        }
    });    
})

app.get('/vagas', (req, res) => {
    let body = req.body;
    const dadosHistorico = pegaVagasdeEmprego();
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function(err, results){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        else
        {
            res.status(200); 
            console.log(res.statusCode); 
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    }); 
})


app.post('/vagas/inscricao', (req, res) => {
    let body = req.body;
    const dadosHistorico = inscricaoAlunosVagas(body.id_aluno, body.id_vaga);
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function(err, results){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        else
        {
            res.status(200); 
            console.log(res.statusCode); 
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    }); 
})

//Sucesso
app.get('/vagas/inscrito', (req, res) => {
    let body = req.body;
    const comando = pegaAlunosVagas(body.id_aluno);
    console.log(comando);
    connection.query(comando, function(err, results){
        if (err)
        {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau"); 
        } 
        else
        {
            let vagasInscritas: any[] = [];
            for (const vagas_de_emprego of results)
            {
                console.log(vagas_de_emprego);
                const comando2 = pegaVagasdeEmpregoAluno(vagas_de_emprego.id_vaga);
                console.log(comando2);
                connection.query(comando2, function(err, results){
                    if (err) throw err;
                    else
                    {
                        let objeto = JSON.stringify(results[0]);

                        vagasInscritas.push(objeto);  
                    }
                });          
            }
            console.log(vagasInscritas);
            res.status(200); 
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(vagasInscritas)); // passamos o objeto para JSON e devolvemos.
        }
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