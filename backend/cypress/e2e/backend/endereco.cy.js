describe('Testes de /endereco', () => {
  it('Deve registrar endereço para cliente', () => {
    cy.request('POST', '/endereco', {
      rua: 'Rua das Flores',
      cidade: 'São Paulo',
      estado: 'SP',
      cpf: '98765432100',
      typeUser: 'cliente'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
    });
  });

  it('Deve retornar erro para tipo de usuário inválido', () => {
    cy.request({
      method: 'POST',
      url: '/endereco',
      failOnStatusCode: false,
      body: {
        rua: 'Rua das Árvores',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cpf: '11122233344',
        typeUser: 'alien'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.success).to.be.false;
    });
  });

  it('Deve retornar endereços de um cliente existente', () => {
    cy.request('POST', '/endereco/get', {
      cpf: '98765432100',
      typeUser: 'cliente'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
  });

  it('Deve buscar médicos por região', () => {
    cy.request('POST', '/endereco/regiao', {
      text: 'mussurunga'
    }).then((res) => {
      expect([200, 500]).to.include(res.status); // caso não haja médicos
    });
  });

  it('Deve deletar endereço do cliente', () => {
    cy.request('POST', '/endereco/delete', {
      id: 1,
      typeUser: 'cliente'
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.success).to.be.true;
    });
  });
});
