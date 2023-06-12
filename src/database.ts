import mysql from 'mysql'
const uuid = require("uuid")
import { readJSONFile } from './leitordeJSON';
import { alunos } from "./interfaces/alunos";
import { empresas } from "./interfaces/empresas";
import { mentores } from "./interfaces/mentores";
import { treinamentos } from "./interfaces/treinamentos";
import { questao } from "./interfaces/questao";
import { historicoAlunos } from "./interfaces/historicoAlunos";
import { vagasEmprego } from "./interfaces/vagasEmprego";

export function criarConexao() {
    const jsonObject = readJSONFile();
    let connection = mysql.createConnection({
        host: jsonObject.host,
        database: jsonObject.database,
        user: jsonObject.user,
        password: jsonObject.password
    });

    return connection;
}

///INSERT'S 

export function procurarUsuario(objeto: any) {
    let comando = "SELECT * FROM " + objeto.usuario + " where email = \"" + objeto.email + "\" and senha = \"" + objeto.senha + "\"";
    return comando;
}

export function emailJaExiste(objeto: any) {
    let comando = "SELECT * FROM " + objeto.usuario + " where email = \"" + objeto.email + "\"";
    return comando;
}

export function inserirAluno(objeto: alunos) {
    let comando = "INSERT INTO alunos (id,nome,senha,email,curso) " +
        "values (\"" + uuid.v4() + "\", \"" + objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.curso + "\");";
    return comando;
}

export function inserirEmpresas(objeto: empresas) {
    let comando = "INSERT INTO empresas (id,nome,senha,email,CNPJ) " +
        "values (\"" + uuid.v4() + "\", \"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function inserirMentores(objeto: mentores) {
    let comando = "INSERT INTO mentores (id, nome,senha,email,CPF) " +
        "values (\"" + uuid.v4() + "\", \"" + objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

//inseri o treinamento e o seus dados na tabela treinamentos
export function inserirTreinamentos(objeto: treinamentos) {
    let id = uuid.v4();
    let comando = "INSERT INTO treinamentos (id, nome_comercial, descricao, carga_horaria,comeco_insc,fim_insc,comeco_treinamento,fim_treinamento, qntd_min_insc," +
        "qntd_max_insc) " +
        "values (\"" + id + "\", \"" + objeto.nome_comercial + "\",\"" + objeto.descricao + "\",\"" + objeto.carga_horaria + "\",\"" + objeto.comeco_insc + "\",\"" +
        objeto.fim_insc + "\",\"" + objeto.comeco_treinamento + "\",\"" + objeto.fim_treinamento + "\",\"" + objeto.qntd_max_insc + "\",\"" + objeto.qntd_min_insc + "\");";
    return [id, comando];
}

export function inserirQuiz(id_treinamentos: String) {
    let id = uuid.v4();
    let comando = "INSERT INTO quiz (id, id_treinamentos) " +
        "values (\"" + id + "\",\"" + id_treinamentos + "\" );";
    return [id, comando];
}

export function inserirQuestao(objeto: questao, id_quiz: String) {
    let comando = "INSERT INTO questao (id, id_quiz, enunciado, resposta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e) " +
        "values (\"" + uuid.v4() + "\", \"" + id_quiz + "\",\"" + objeto.enunciado + "\",\"" + objeto.resposta + "\",\"" + objeto.opcao_a + "\",\"" + objeto.opcao_b + "\",\""
        + objeto.opcao_c + "\",\"" + objeto.opcao_d + "\",\"" + objeto.opcao_e + "\" );";
    return comando;pegarQuiz
}

/// prototipo do post treinamentos_alunos
export function inserirTreinamentosAlunos(id_aluno: String, id_treinamentos: String) {
    let comando = "INSERT INTO treinamentos_alunos (id_aluno, id_treinamentos, status) values (\"" + id_aluno + "\",\"" + id_treinamentos + "\",\"c\" );";
    return comando;
}

/// prototipo do post historico_alunos
//Falta so conferir como vamos passar os parametros
export function inserirHistoricoAlunos(id_aluno : string, id_quiz : string, nota : any) {
    let comando = "INSERT INTO historico_alunos (id_aluno, id_quiz, nota) values (\"" + id_aluno + "\",\"" + id_quiz + "\",\"" + nota + "\" );";
    return comando;
}

//Cria a vaga de emprego
export function criaVagasdeEmprego(objeto: vagasEmprego) {
    let comando = "INSERT INTO vagas_de_emprego (id, id_empresa, titulo_vaga, descricao, requisitos, salario) values (\"" + uuid.v4() + "\",\"" + objeto.id_empresa + "\",\""
        + objeto.titulo_vaga + "\",\"" + objeto.descricao + "\",\"" + objeto.requisitos + "\",\"" + objeto.salario + "\" );";
    return comando;
}

//Inscreve o aluno numa vaga de emprego
export function inscricaoAlunosVagas(id_aluno: string, id_vaga: string) {
    let comando = "INSERT INTO alunos_vagas (id_aluno, id_vaga) values (\"" + id_aluno + "\",\"" + id_vaga + "\" );";
    return comando;
}

export function inserirQuizAptidao(id_quiz : string){
    let comando = "INSERT INTO quizAptidao (id_quiz,elegivel) values (\"" + id_quiz + "\",\"n\");";
    return comando;
}  

///SELECT'S

/// prototipo do get treinamentos_alunos -- get
export function pegaTreinamentosAlunos(id_aluno: String) {
    let comando = "SELECT * FROM treinamentos where id IN (SELECT id_treinamento FROM treinamentos_alunos where id_aluno = \"" + id_aluno + "\")";
    return comando;
}

// Mostra as vagas que o aluno está inscrito
export function pegaTreinamentos(id_aluno : string){
    let comando = "SELECT * FROM treinamentos where id NOT IN (SELECT id_treinamento FROM treinamentos_alunos where id_aluno = \"" + id_aluno + "\");";
    return comando;
}

/// prototipo do get historico_alunos
export function pegaHistoricoAlunos(id_aluno: String) {
    let comando = "SELECT * FROM historico_alunos where id_aluno = \"" + id_aluno + "\"";
    return comando;
}

//Pega a vaga de emprego, para mostrar para os usuarios
export function pegaTodasVagasdeEmprego() {
    let comando = "SELECT * FROM vagas_de_emprego";
    return comando;
}

// Mostra as vagas que o aluno está inscrito
export function pegaAlunoVagas(id_aluno : string){
    let comando = "SELECT * FROM vagas_de_emprego where id IN (SELECT id_vaga FROM alunos_vagas where id_aluno = \"" + id_aluno + "\");";
    return comando;
}

//Pega todos os id's dos treinamentos de uma empresa
export function pegaVagasdeEmprego(id_emperesa : string){
    let comando = "SELECT * FROM vagas_de_emprego where id_empresa = \"" + id_emperesa + "\";";
    return comando;
}

// Mostra as vagas que o aluno está inscrito
export function pegaVagaAlunos(id_vaga : string){
    let comando = "SELECT nome FROM alunos where id IN (SELECT id_aluno FROM alunos_vagas where id_vaga = \"" + id_vaga + "\");";
    return comando;
}

//Retorna as respostas de um quiz  
export function pegaGabaritoQuiz(id_quiz : string) {
    let comando = "SELECT resposta FROM questao where id_quiz = \"" + id_quiz + "\"";
    return comando;
}

//Pega o quiz aptidão
export function pegarQuizAptidao(id_treinamentos : string){
    let comando = "SELECT * FROM questao where id_quiz = (SELECT id_quiz FROM quiz,quizAptidao where quiz.id_treinamentos = \"" + id_treinamentos + "\" and quizAptidao.id_quiz = quiz.id);";
    return comando;
}  

//Pega todas as questões de um quiz
export function pegarQuiz(id_quiz : string){
    let comando = "SELECT * FROM questao where id_quiz = \"" + id_quiz + "\";";
    return comando;
}  

///DELETE'S 

/// prototipo do get treinamentos_alunos -- get
export function deletaTreinamentosAlunos(id_aluno: String, id_treinamento : string) {
    let comando = "DELETE FROM treinamentos_alunos where id_aluno = \"" + id_aluno + "\" and id_treinamento = \"" + id_treinamento + "\")";
    return comando;
}

//Deleta uma vaga de emprego
export function deletaVaga(id_vaga: string) {
    let comando = "DELETE FROM vagas_de_emprego where id_vaga = \"" + id_vaga + "\";"
    return comando;
}

//Desinscreve todos os alunos numa vaga de emprego na tabela alunos_vagas
export function deletaAlunosVaga(id_vaga: string) {
    let comando = "DELETE FROM alunos_vagas where id_vaga = \"" + id_vaga + "\";"
    return comando;
}

//Desinscreve um aluno de uma vaga de emprego
export function deletaAlunoVaga(id_aluno: string, id_vaga: string) {
    let comando = "DELETE FROM alunos_vagas where id_aluno = \"" + id_aluno + "\" and id_vaga = \"" + id_vaga + "\";"
    return comando;
}








