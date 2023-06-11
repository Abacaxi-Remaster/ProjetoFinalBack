import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { inserirAluno, criarConexao, inserirEmpresas, inserirMentores, inserirTreinamentos, inserirQuiz, 
    inserirQuestao, pegaHistoricoAlunos, criaVagasdeEmprego, pegaTodasVagasdeEmprego, inscricaoAlunosVagas, 
    pegaAlunoVagas, pegaVagaAlunos, inserirTreinamentosAlunos, pegaTreinamentosAlunos, procurarUsuario, 
    emailJaExiste, pegaTreinamentos, inserirHistoricoAlunos, inserirQuizAptidao, pegaVagasdeEmprego, pegarQuizAptidao, deletaTreinamentosAlunos, pegaGabaritoQuiz, deletaAlunosVagas} from './database';


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
    connection.query(sql, function (err: any, results: any) {
        if (err) throw err;
        res.send(results);
    });
})
//Sucesso 
app.post('/login', (req, res) => {
    let body = req.body;
    let comando = procurarUsuario(body);
    console.log(comando);
    connection.query(comando, function (err: any, results: string | any[]) {
        if (err) {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("LOGIN_FAILED");
        }
        //precisa de [0], pq o "results" devolve uma array com todos os "rows" encontrados em forma de objeto, 
        //como sempre sera apenas 1 usuario ou nenhum, usamos o index 0, para acessar o objeto enviado.
        else if (results[0] != null) {
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(results[0])); // passamos o objeto para JSON e devolvemos.
        }
        else {
            res.set('Content-Type', 'application/json');
            res.status(204).send("USER_NOT_FOUND");
        }
    });
})

//Sucesso       
app.post('/cadastro', (req, res) => {
    let body = req.body;
    let comando: any;

    // analisa qual usuario sera criado
    switch (body.usuario) {
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

    let comando2 = emailJaExiste(body);

    connection.query(comando2, function (err: any, results: any) {
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("Procura do email falhou");
        }
        else if(results[0] != null) {
            res.status(204).send(JSON.stringify("Email já existe"));
        }
        else {
            connection.query(comando, function (err: any, results: any) {
                res.set('Content-Type', 'application/json');
                if (err) {
                    res.status(400).send("REGISTER_FAILED");
                }
                else {
                    console.log(results);
                    res.status(200).send(JSON.stringify("Conta criada!"));
                }
            });
        }
    });
})

//Insere os treinamentos, quizes e questöes
app.post('/treinamentos/cadastro', (req, res) => {
    let body = req.body;
    const dadosTreinamentos = inserirTreinamentos(body.treinamentos);
    console.log(dadosTreinamentos);
    connection.query(dadosTreinamentos[1], function (err: any, results: any) {
        if (err) throw err;
        console.log(results);
    });

    let flag = 0;
    for (const quiz of body.quiz) {
        let dadosQuiz = inserirQuiz(dadosTreinamentos[0]);
        connection.query(dadosQuiz[1], function (err: any, results: any) {
            if (err) throw err;
            console.log(results);
        });        
        if (flag == 0){
            connection.query(inserirQuizAptidao(dadosQuiz[0]), function (err: any, results: any) {
                if (err) throw err;
                console.log(results);
            });
            flag = flag + 1;
        }
        for (const questao of quiz) {
            let dadosQuestao = inserirQuestao(questao, dadosQuiz[0]);
            console.log(dadosQuestao);
            console.log("\n");
            connection.query(dadosQuestao, function (err: any, results: any) {
                if (err) throw err;
                console.log(results);
            });
        }    
    }

    res.set('Content-Type', 'application/json');
    res.status(200).send("Foi");
})

///pega o historico de um aluno
app.get('/historico_alunos/:id', (req, res) => {
    let id_empresa = req.params.id;
    const dadosHistorico = pegaHistoricoAlunos(id_empresa);
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function(err: any, results: any){
        if (err) {
            res.status(500);
            res.send("Erro histórico de alunos");
        } else {
            console.log(results);
            res.status(200);
            res.json(results);
        }
    }); 
});

//Cadastra um quiz feito na tabela historico_aluno
app.post('/historico_alunos/cadastro', (req, res) => {
    let body = req.body; 
    let comando = pegaGabaritoQuiz(body.id_quiz); 
    connection.query(comando, (err: any, results: any) => {
        if (err) {
            res.status(400).send("Problema ao procurar o gabarito");
        }
        console.log(results);
        let numQuest = 0;
        let acertos = 0;
        for (var gabarito of results){
            if(body.resposta[numQuest] == gabarito.resposta)
                acertos++;
            numQuest++;
        }
        let nota = 100*acertos/numQuest
        comando = inserirHistoricoAlunos(body.id_aluno, body.id_quiz, nota)
        console.log("chegou");
        connection.query(comando, function (err, results) {
            console.log(results);
            res.set('Content-Type', 'application/json');
            if (err) {
                console.log(err);
                res.status(400).send("Problema no cadastro do historico");
            }
            else {
                res.status(200).send(JSON.stringify("Deu certo!"));
            }
        });
    });
});
 

//Inserir uma vaga 
app.post('/vagas/cadastro', (req, res) => {
    let body = req.body;
    console.log(body);
    let comando = criaVagasdeEmprego(body);
    console.log(comando);
    connection.query(comando, function (err, results) {
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("Deu pau");
        }
        else {
            res.status(200).send(JSON.stringify("Deu certo!"));
        }
    });
})

//Retorna todas as vagas registradas 
app.get('/vagas', (req, res) => {
    const dadosHistorico = pegaTodasVagasdeEmprego();
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function (err, results) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("Deu pau");
        }
        else {
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Insere um aluno e um vaga na tabela alunos_vagas
app.post('/vagas/inscricao', (req, res) => {
    let body = req.body;
    const dadosHistorico = inscricaoAlunosVagas(body.id_aluno, body.id_vaga);
    console.log(dadosHistorico);
    connection.query(dadosHistorico, function (err, results) {
        if (err) {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau");
        }
        else {
            res.status(200);
            console.log(res.statusCode);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Insere um aluno e um vaga na tabela alunos_vagas
app.post('/vagas/deleta', (req, res) => {
    let body = req.body;
    const comando = deletaAlunosVagas(body.id_aluno, body.id_vaga);
    console.log(comando);
    connection.query(comando, function (err, results) {
        if (err) {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau");
        }
        else {
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Pega todas as vagas que um aluno está inscrito 
app.get('/vagas/inscrito/:id', (req, res) => {
    let id_aluno = req.params.id;
    const comando = pegaAlunoVagas(id_aluno);
    console.log(comando);
    connection.query(comando, function (err, results) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            console.log(err);
            res.status(400).send("Deu pau");
        } else {
            console.log(results);
            res.status(200).send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})


//Pega todas as vagas que uma empresa criou 
app.get('/vagas/empresa/:id', (req, res) => {
    let id_empresa = req.params.id;
    const comando = pegaVagasdeEmprego(id_empresa);
    console.log(comando);
    connection.query(comando, function (err, results) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            console.log(err);
            res.status(400).send("Deu pau");
        } else {
            console.log(results);
            res.status(200).send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Pega todos os alunos inscritos em cada vaga da tabela vagas_alunos
app.get('/vagas/todosInscritos/:id', (req, res) => {
    let id_vaga = req.params.id;
    const comando = pegaVagaAlunos(id_vaga);
    console.log(comando);
    connection.query(comando, function (err, results) {
        if (err) {
            console.log(err);
            res.set('Content-Type', 'application/json');
            res.status(400).send("Deu pau");
        } 
        else {
            console.log(results);
            res.status(200).send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Retorna todas os treinamentos registrados menos os ja inscritos pelo aluno da tabela treinamentos
app.get('/treinamentos/:id', (req, res) => {
    let id_aluno = req.params.id;
    const comando = pegaTreinamentos(id_aluno);
    console.log(comando);
    connection.query(comando, function (err, results) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("Deu pau");
        }
        else {
            res.status(200).send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
        }
    });
})

//Insere um aluno e um treinamento na tabela treinamentos_alunos
app.post('/treinamento/cadastro', (req, res) => {
    let body = req.body;
    console.log(body);
    let comando = inserirTreinamentosAlunos(body.id_aluno, body.id_treinamentos);
    console.log(comando);
    connection.query(comando, function (err: any, results: string | any[]) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("ERRO_ENTRAR_TREINAMENTO");
        }
        console.log(results);
        res.status(200).send(JSON.stringify("Aluno inserido no treinamento")); // passamos o objeto para JSON e devolvemos.
    });
})

//Mostra todos os treinamentos de um aluno da tabela treinamentos_alunos
app.get('/treinamento/aluno/:id', (req, res) => {
    let id_aluno = req.params.id;
    console.log(id_aluno);
    let comando = pegaTreinamentosAlunos(id_aluno);
    console.log(comando);
    connection.query(comando, function (err: any, results: string | any[]) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("ERRO_BUSCAR_TREINAMENTOS");
        }
        console.log(results);
        res.status(200).send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
    });
})

//Deleta um aluno e um treinamento na tabela treinamentos_alunos
app.post('/treinamento/deleta', (req, res) => {
    let body = req.body;
    console.log(body);
    let comando = deletaTreinamentosAlunos(body.id_aluno, body.id_treinamentos);
    console.log(comando);
    connection.query(comando, function (err: any, results: string | any[]) {            
        res.set('Content-Type', 'application/json');
        if (err) {
            res.status(400).send("ERRO_ENTRAR_TREINAMENTO");
        }
        console.log(results);
        res.status(200).send(JSON.stringify("Aluno inserido no treinamento")); // passamos o objeto para JSON e devolvemos.
    });
})

//Pegar quiz aptidao
app.get('/quiz/aptidao/:id', (req, res) => {
    let id_treinamento = req.params.id;
    const comando = pegarQuizAptidao(id_treinamento);
    console.log(comando);
    connection.query(comando, function (err, results) {
        if (err) {
            res.status(400);
            res.set('Content-Type', 'application/json');
            res.send("Deu pau");
        }
        else {
            res.status(200);
            res.set('Content-Type', 'application/json');
            console.log(results);
            res.send(JSON.stringify(results)); // passamos o objeto para JSON e devolvemos.
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