describe('Testes de /login', () => {
  it('Deve registrar novo cliente com sucesso', () => {
    cy.request('POST', '/login/register', {
      email: 'cliente3@teste.com',
      password: 'senha123',
      typeUser: 'cliente',
      nome: 'Cliente Testezissimo',
      cpf: '98765432102',
      telefone: '11999999997'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
    });
  });

  it('Deve impedir registro duplicado', () => {
    cy.request({
      method: 'POST',
      url: '/login/register',
      failOnStatusCode: false,
      body: {
      email: 'cliente3@teste.com',
      password: 'senha123',
      typeUser: 'cliente',
      nome: 'Cliente Testezissimo',
      cpf: '98765432102',
      telefone: '11999999997'
      }
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it('Deve realizar login com sucesso', () => {
    cy.request('POST', '/login', {
      email: 'cliente@teste.com',
      password: 'senha123',
      typeUser: 'cliente'
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('token');
    });
  });

  it('Deve falhar com senha incorreta', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: {
        email: 'cliente@teste.com',
        password: 'senhaErrada',
        typeUser: 'cliente'
      }
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Senha incorreta.');
    });
  });

  it('Deve falhar ao logar com usuário inexistente', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: {
        email: 'inexistente@teste.com',
        password: 'senha123',
        typeUser: 'cliente'
      }
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.success).to.be.false;
    });
  });
});
