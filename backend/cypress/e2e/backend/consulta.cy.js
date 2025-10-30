describe('Testes de /consulta', () => {
  const baseUrl = 'http://localhost:3000/tasks'; // ajusta se tua rota for diferente

  it('Deve registrar uma nova consulta', () => {
    const novaConsulta = {
      codigo: Math.floor(Math.random() * 10000),
      data: '2025-12-25 10:00:00',
      descricao: 'Consulta de rotina',
      medico_cpf: '222.222.222-22',
      user: '111.111.111-11'
    };

    cy.request('POST', `${baseUrl}/add`, novaConsulta)
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.success).to.be.true;
      });
  });

  it('Deve retornar erro para ID de consulta já cadastrado', () => {
    const consultaExistente = {
      codigo: 134,
      data: '2025-12-25 10:00:00',
      descricao: 'Consulta repetida',
      medico_cpf: '222.222.222-22',
      user: '111.111.111-11'
    };

    cy.request({
      method: 'POST',
      url: `${baseUrl}/add`,
      body: consultaExistente,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.success).to.be.false;
    });
  });

  it('Deve buscar consultas de um cliente existente', () => {
    cy.request('POST', `${baseUrl}/`, {
      id: '111.111.111-11',
      typeUser: 'cliente'
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
  });

  it('Deve marcar uma consulta como realizada', () => {
    cy.request('POST', `${baseUrl}/realizar`, { codigo: 134 })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.success).to.be.true;
      });
  });

  it('Deve listar todos os médicos cadastrados', () => {
    cy.request('GET', `${baseUrl}/getMedicos`)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('array');
      });
  });
});
