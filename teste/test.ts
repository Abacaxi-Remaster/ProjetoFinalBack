const request = require('supertest');
const app = require('../src/index');

describe('POST /cadastro', () => {
  const userData = {
    usuario: "alunos",
    email: "aaaaaaaaaa@gmail.com",
    senha: "321",
    nome: "Luis Felipe",
    curso: "Eng. de Comp"
  }
  const invalidUserData = {
      usuario: "alunos",
      email: "damanga@gmail.com",
      senha: "321",
      nome: "Luis Felipe",
      curso: "Eng. de Comp"
  };

  it('Deve estar certo', async () => {
    const response = await request(app).post('/cadastro').send(userData);
    expect(response.status).toBe(200);
  });

  it('Deve retornar erro pois já existe esse email', async () => {

    const response = await request(app).post('/cadastro').send(invalidUserData);
    expect(response.status).toBe(204);
  });

});