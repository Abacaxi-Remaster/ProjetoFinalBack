import exp from 'constants';
import mysql from 'mysql'
const uuid = require("uuid")
import { readJSONFile } from './leitordeJSON';
import { alunos } from "./interfaces/alunos";
import { empresas } from "./interfaces/empresas";
import { mentores } from "./interfaces/mentores";
import { treinamentos } from "./interfaces/treinamentos";
import { questao } from "./interfaces/questao";

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

export function inserirAluno(objeto: alunos) {
    let comando = "INSERT INTO alunos (id,nome,senha,email,curso) values (\"" + uuid.v4() + "\", \"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.curso + "\");";
    return comando;
}

export function inserirEmpresas(objeto: empresas) {
    let comando = "INSERT INTO empresas (id,nome,senha,email,CNPJ) values (\"" + uuid.v4() + "\", \"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function inserirMentores(objeto: mentores) {
    let comando = "INSERT INTO mentores (id, nome,senha,email,CPF) values (\"" + uuid.v4() + "\", \"" +
        objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

export function inserirTreinamentos(objeto: treinamentos) {
    let id = uuid.v4();
    let comando = "INSERT INTO treinamentos (id, nome_comercial, descricao, carga_horaria,comeco_insc,fim_insc,comeco_treinamento,fim_treinamento, qntd_min_insc," +
        "qntd_max_insc) values (\"" + id + "\", \"" + objeto.nome_comercial + "\",\"" + objeto.descricao + "\",\"" + objeto.carga_horaria + "\",\"" + objeto.comeco_insc + "\",\"" +
        objeto.fim_insc + "\",\"" + objeto.comeco_treinamento + "\",\"" + objeto.fim_treinamento + "\",\"" + objeto.qntd_max_insc + "\",\"" + objeto.qntd_min_insc + "\");";
    return [id, comando];
}

export function inserirQuiz(id_treinamentos: String) {
    let id = uuid.v4();
    let comando = "INSERT INTO quiz (id, id_treinamentos) values (\"" + id + "\",\"" + id_treinamentos + "\" );";
    return [id, comando];
}

export function inserirQuestao(objeto: questao, id_quiz: String) {
    let comando = "INSERT INTO questao (id, id_quiz, enunciado, resposta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e) " +
        "values (\"" + uuid.v4() + "\", \"" + id_quiz + "\",\"" + objeto.enunciado + "\",\"" + objeto.resposta + "\",\"" + objeto.opcao_a + "\",\"" + objeto.opcao_b + "\",\""
        + objeto.opcao_c + "\",\"" + objeto.opcao_d + "\",\"" + objeto.opcao_e + "\" );";
    return comando;
}

export function pegaHistorico(id_aluno: String) {
    let comando = "SELECT * FROM historico_aluno where id_aluno = \"" + id_aluno + "\"";
    return comando;
}