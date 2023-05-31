import mysql from 'mysql'
import { readJSONFile } from './leitordeJSON';

export function criarConexao() {
    
    const jsonObject = readJSONFile();
    var connection = mysql.createConnection({
        host: jsonObject.host,
        database: jsonObject.database,
        user: jsonObject.user,
        password: jsonObject.password
    });

    return connection;
}


interface alunos 
{
    "email": string,
    "senha": string,
    "curso": string,
    "nome": string
}

interface empresas 
{
    "email": string,
    "senha": string,
    "CNPJ": number,
    "nome": string
}

interface mentores 
{
    "email": string,
    "senha": string,
    "CPF": number,
    "nome": string
}

interface treinamentos 
{
    "id": number,
    "nome_comercial": string,
    "descricao": string,
    "carga_horaria": number,
    "comeco_insc": string,
    "fim_insc": string,
    "comeco_treinamento": string,
    "fim_treinamento":string,
    "qntd_min_insc": number,
    "qntd_max_insc": number
}

interface quiz 
{
    "id": number,
    "id_treinamento": number,
    "enunciado": string,
    "resposta": string,
    "opcao_a": string,
    "opcao_b": string,
    "opcao_c": string,
    "opcao_d": string,
    "opcao_e": string
}

export function criaAluno(objeto : alunos){
    var comando = "INSERT INTO alunos (nome,senha,email,curso) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.curso + "\");";
    return comando;
}

export function criaEmpresas(objeto : empresas){
    var comando = "INSERT INTO empresas (nome,senha,email,CNPJ) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function criaMentores(objeto : mentores){
    var comando = "INSERT INTO mentores (nome,senha,email,CPF) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

export function criaTreinamentos (objeto: treinamentos){
    var comando = "INSERT INTO treinamentos (id, nome_comercial, descricao, carga_horaria,comeco_insc,fim_insc,comeco_treinamento,fim_treinamento, qntd_min_insc," +
    "qntd_max_insc) values (0,\"" + objeto.nome_comercial +"\",\"" + objeto.descricao + "\",\"" + objeto.carga_horaria + "\",\"" + objeto.comeco_insc + "\",\"" + 
    objeto.fim_insc + "\",\"" +  objeto.comeco_treinamento + "\",\""+objeto.fim_treinamento+"\",\"" + objeto.qntd_max_insc + "\",\"" + objeto.qntd_min_insc + "\");";
    return comando;
} 

export function criaQuiz(objeto: quiz){
    var comando ="INSERT INTO Quiz (id, id_treinamento, enunciado, resposta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e) " 
    "values (0,\""+ objeto.id_treinamento + "\",\"" + objeto.enunciado + "\",\"" + objeto.resposta +"\",\"" + objeto.opcao_a +"\",\"" + objeto.opcao_b +"\",\"" 
    + objeto.opcao_c +"\",\"" + objeto.opcao_d +"\",\"" + objeto.opcao_e +"\" );";
    return comando;
}

  
