import exp from 'constants';
import mysql from 'mysql'
const uuid = require("uuid")
import { readJSONFile } from './leitordeJSON';

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
    "id": string,
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

interface questao
{
    "id": string,
    "enunciado": string,
    "resposta": string,
    "opcao_a": string,
    "opcao_b": string,
    "opcao_c": string,
    "opcao_d": string,
    "opcao_e": string
}

interface historico_alunos
{
    "id_aluno": string,
    "id_quiz": string,
    "nota": number
}

interface vagas_emprego
{
    "titulo_vaga": string,
    "id_empresa": string, 
    "descricao": string,
    "requesitos": string,
    "salario": string
}


export function criaAluno(objeto : alunos){
    let comando = "INSERT INTO alunos (id,nome,senha,email,curso) values (\"" + uuid.v4() + "\", \"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.curso + "\");";
    return comando;
}

export function criaEmpresas(objeto : empresas){
    let comando = "INSERT INTO empresas (id,nome,senha,email,CNPJ) values (\"" + uuid.v4() + "\", \"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CNPJ + "\");";
    return comando;
}

export function criaMentores(objeto : mentores){
    let comando = "INSERT INTO mentores (id, nome,senha,email,CPF) values (\"" + uuid.v4() + "\", \"" +
    objeto.nome + "\", \"" + objeto.senha + "\", \"" + objeto.email + "\", \"" + objeto.CPF + "\");";
    return comando;
}

export function criaTreinamentos (objeto: treinamentos){
    let id = uuid.v4();
    let comando = "INSERT INTO treinamentos (id, nome_comercial, descricao, carga_horaria,comeco_insc,fim_insc,comeco_treinamento,fim_treinamento, qntd_min_insc," +
    "qntd_max_insc) values (\"" + id + "\", \"" + objeto.nome_comercial +"\",\"" + objeto.descricao + "\",\"" + objeto.carga_horaria + "\",\"" + objeto.comeco_insc + "\",\"" + 
    objeto.fim_insc + "\",\"" +  objeto.comeco_treinamento + "\",\""+objeto.fim_treinamento+ "\",\"" + objeto.qntd_max_insc + "\",\"" + objeto.qntd_min_insc + "\");";
    return [id, comando];
} 

export function criaQuiz(id_treinamentos : String){
    let id = uuid.v4();
    let comando ="INSERT INTO quiz (id, id_treinamentos) values (\"" + id + "\",\"" + id_treinamentos + "\" );";
    return [id, comando];
}

export function criaQuestao(objeto: questao, id_quiz : String){
    let comando ="INSERT INTO questao (id, id_quiz, enunciado, resposta, opcao_a, opcao_b, opcao_c, opcao_d, opcao_e) " +
    "values (\"" + uuid.v4() + "\", \"" + id_quiz + "\",\"" + objeto.enunciado + "\",\"" + objeto.resposta + "\",\"" + objeto.opcao_a + "\",\"" + objeto.opcao_b + "\",\"" 
    + objeto.opcao_c + "\",\"" + objeto.opcao_d + "\",\"" + objeto.opcao_e + "\" );";
    return comando;
}

/// prototipo do get treinamentos_alunos
export function pegaTreinamentosAlunos(id_aluno : String){
    let comando = "SELECT * FROM treinamentos_alunos where id_aluno = \"" + id_aluno + "\"";
    return comando;
}

/// prototipo do post treinamentos_alunos
export function criaTreinamentosAlunos(id_aluno : String, id_treinamentos : String){
    let comando ="INSERT INTO treinamentos_alunos (id_aluno, id_treinamentos, status) values (\"" + id_aluno + "\",\"" + id_treinamentos + "\",\"c\" );";
    return comando;
}

/// prototipo do get historico_alunos
export function pegaHistoricoAlunos(id_aluno : String){
    let comando = "SELECT * FROM historico_alunos where id_aluno = \"" + id_aluno + "\"";
    return comando;
}

/// prototipo do post historico_alunos
//Falta so conferir como vamos passar os parametros
export function criaHistoricoAlunos(objeto : historico_alunos){
    let comando ="INSERT INTO historico_alunos (id_aluno, id_quiz, nota) values (\"" + objeto.id_aluno + "\",\"" + objeto.id_quiz + "\",\"" + objeto.nota + "\" );";
    return comando;
}

//Cria a vaga de emprego
export function criaVagasdeEmprego(objeto : vagas_emprego){
    let comando ="INSERT INTO vagas_de_emprego (id, id_empresa, titulo_vaga, descricao, requesitos, salario) values (\"" + uuid.v4() + "\",\"" + objeto.id_empresa + "\",\"" 
    + objeto.titulo_vaga + "\",\"" + objeto.descricao + "\",\"" + objeto.requesitos + "\",\"" + objeto.salario + "\" );";
    return comando;
}

//Pega a vaga de emprego, para mostrar para os usuarios
export function pegaVagasdeEmprego(){
    let comando = "SELECT * FROM vagas_de_emprego";
    return comando;
}

//Inscreve o aluno numa vaga de emprego
export function inscricaoAlunosVagas(id_aluno : string, id_vaga : string){
    let comando ="INSERT INTO alunos_vagas (id_aluno, id_vaga) values (\"" + id_aluno + "\",\"" + id_vaga + "\" );";
    return comando;
}

// Mostra as vagas que o aluno está inscrito
export function pegaAlunosVagas(id_aluno : string){
    let comando = "SELECT * FROM alunos_vagas where id_aluno = \"" + id_aluno + "\"";
    return comando;
}

export function pegaVagasdeEmpregoAluno(id_vaga : string){
    let comando = "SELECT * FROM vagas_de_emprego where id = \"" + id_vaga + "\"";
    return comando;
}