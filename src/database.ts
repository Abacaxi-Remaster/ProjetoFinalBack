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
    "id": number,
    "email": string,
    "senha": string,
    "nicho": string,
    "nome": string
}

interface empresas 
{
    "id": number,
    "email": string,
    "senha": string,
    "CNPJ": number,
    "nome": string
}

interface professores 
{
    "id": number,
    "email": string,
    "senha": string,
    "CPF": number,
    "nome": string
}

interface adms 
{
    "id": number,
    "email": string,
    "senha": string,
    "nome": string
}

var connection = criarConexao();

export function criaAluno(objeto : alunos){
    var comando = "INSERT INTO alunos (nome,senha,email,nicho) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.nicho + "\");";
    return comando;
}

export function criaEmpresas(objeto : empresas){
    var comando = "INSERT INTO empresas (nome,senha,email,CNPJ) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function criaProfessores(objeto : professores){
    var comando = "INSERT INTO professores (nome,senha,email,CPF) values (\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

