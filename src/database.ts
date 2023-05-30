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

interface Treinamentos 
{
    "id": number,
    "nome_comercial": string,
    "descricao": string,
    "carga_horaria": number,
    "comeco_fim_insc": string,
    "comeco_fim_treinamento": string,
    "qntd_min_insc": number,
    "qntd_max_insc": number,
  }

export function criaAluno(objeto : alunos){
    var comando = "INSERT INTO alunos (id, nome,senha,email,nicho) values (0,\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.nicho + "\");";
    return comando;
}

export function criaEmpresas(objeto : empresas){
    var comando = "INSERT INTO empresas (id,nome,senha,email,CNPJ) values (0,\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function criaProfessores(objeto : professores){
    var comando = "INSERT INTO professores (id,nome,senha,email,CPF) values (0,\"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

export function criaTreinamentos (objeto: Treinamentos){
    var comando = "INSERT INTO treinamentos (id, nome_comercial, descricao, carga_horaria, comeco_fim_insc, comeco_fim_treinamento, qntd_min_insc, qntd_max_insc)"  
    "values (0,\"" + objeto.nome_comercial +"\",\"" + objeto.descricao + "\",\"" + objeto.carga_horaria + "\",\"" + objeto.comeco_fim_insc + "\",\"" + 
    objeto.comeco_fim_treinamento + "\",\"" + objeto.qntd_max_insc + "\",\"" + objeto.qntd_min_insc + "\");";
    return comando;
} 

  
