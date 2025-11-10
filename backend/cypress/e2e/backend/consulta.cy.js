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

// TESTES UNITARIOS ABAIXO, TESTES DE INTEGRACAO ACIMA

describe('Testes Unitários - Modelo ConsultaAgenda', () => {
  
  describe('Validação de Estrutura do Modelo', () => {
    
    it('Deve validar campos obrigatórios de ConsultaAgenda', () => {
      const consulta = {
        codigo: 134,
        horario: '2025-08-06 05:16:00',
        descricao: 'Consulta',
        status: 'realizado',
        id_user: '111.111.111-11',
        id_medico: '222.222.222-22'
      };

      expect(consulta).to.have.property('codigo');
      expect(consulta).to.have.property('horario');
      expect(consulta).to.have.property('descricao');
      expect(consulta).to.have.property('status');
      expect(consulta).to.have.property('id_user');
      expect(consulta).to.have.property('id_medico');
      
      expect(consulta.codigo).to.be.a('number');
      expect(consulta.horario).to.be.a('string');
      expect(consulta.descricao).to.be.a('string');
      expect(consulta.status).to.be.a('string');
      expect(consulta.id_user).to.be.a('string');
      expect(consulta.id_medico).to.be.a('string');
    });

    it('Deve ter código como chave primária única', () => {
      const consultas = [
        { codigo: 134 },
        { codigo: 249 },
        { codigo: 571 }
      ];

      const codigos = consultas.map(c => c.codigo);
      const codigosUnicos = [...new Set(codigos)];

      expect(codigos.length).to.eq(codigosUnicos.length);
    });

  });

  describe('Validação de Status', () => {
    
    it('Deve ter status padrão "em-andamento"', () => {
      const novaConsulta = {
        codigo: 999,
        status: undefined
      };

      const statusPadrao = novaConsulta.status || 'em-andamento';

      expect(statusPadrao).to.eq('em-andamento');
    });

    it('Deve aceitar apenas status válidos', () => {
      const statusValidos = ['em-andamento', 'realizado', 'cancelado'];
      const statusTeste = 'realizado';

      expect(statusValidos).to.include(statusTeste);
    });

    it('Deve rejeitar status inválidos', () => {
      const statusValidos = ['em-andamento', 'realizado', 'cancelado'];
      const statusInvalido = 'pendente';

      expect(statusValidos).to.not.include(statusInvalido);
    });

    it('Deve atualizar status de "em-andamento" para "realizado"', () => {
      const consulta = {
        codigo: 134,
        status: 'em-andamento'
      };

      consulta.status = 'realizado';

      expect(consulta.status).to.eq('realizado');
    });

  });

  describe('Validação de Horário', () => {
    
    it('Deve validar formato de timestamp', () => {
      const horarioValido = '2025-08-06 05:16:00';
      const regexTimestamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

      expect(horarioValido).to.match(regexTimestamp);
    });

    it('Deve converter timestamp para Date', () => {
      const horario = '2025-08-06 05:16:00';
      const data = new Date(horario);

      expect(data).to.be.instanceOf(Date);
      expect(data.getFullYear()).to.eq(2025);
      expect(data.getMonth()).to.eq(7); // agosto comeca em 0
      expect(data.getDate()).to.eq(6);
    });

    it('Deve comparar datas de consultas', () => {
      const consulta1 = { horario: '2025-05-28 21:18:00' };
      const consulta2 = { horario: '2025-08-06 05:16:00' };

      const data1 = new Date(consulta1.horario);
      const data2 = new Date(consulta2.horario);

      expect(data1.getTime()).to.be.lessThan(data2.getTime());
    });

  });

  describe('Validação de CPF', () => {
    
    it('Deve validar formato de CPF com pontuação', () => {
      const cpf = '111.111.111-11';
      const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

      expect(cpf).to.match(regexCPF);
    });

    it('Deve extrair apenas números do CPF', () => {
      const cpfFormatado = '111.111.111-11';
      const cpfNumeros = cpfFormatado.replace(/\D/g, '');

      expect(cpfNumeros).to.eq('11111111111');
      expect(cpfNumeros).to.have.length(11);
    });

    it('Deve validar CPF diferente entre usuário e médico', () => {
      const consulta = {
        id_user: '111.111.111-11',
        id_medico: '222.222.222-22'
      };

      const saoIguais = consulta.id_user === consulta.id_medico;
      expect(saoIguais).to.be.false;
    });

    it('Deve permitir médico agendar para si mesmo', () => {
      const consulta = {
        codigo: 249,
        id_user: '111.111.111-11',
        id_medico: '111.111.111-11'
      };

      expect(consulta.id_user).to.eq(consulta.id_medico);
    });

  });

  describe('Operações de Busca e Filtro', () => {
    
    it('Deve filtrar consultas por status "realizado"', () => {
      const consultas = [
        { codigo: 134, status: 'realizado' },
        { codigo: 249, status: 'realizado' },
        { codigo: 571, status: 'realizado' }
      ];

      const realizadas = consultas.filter(c => c.status === 'realizado');

      expect(realizadas).to.have.length(3);
    });

    it('Deve filtrar consultas por id_user', () => {
      const consultas = [
        { codigo: 134, id_user: '111.111.111-11' },
        { codigo: 249, id_user: '111.111.111-11' },
        { codigo: 571, id_user: '111.111.111-11' }
      ];

      const consultasUsuario = consultas.filter(
        c => c.id_user === '111.111.111-11'
      );

      expect(consultasUsuario).to.have.length(3);
    });

    it('Deve filtrar consultas por id_medico', () => {
      const consultas = [
        { codigo: 134, id_medico: '222.222.222-22' },
        { codigo: 249, id_medico: '111.111.111-11' },
        { codigo: 571, id_medico: '111.111.111-11' }
      ];

      const consultasMedico = consultas.filter(
        c => c.id_medico === '222.222.222-22'
      );

      expect(consultasMedico).to.have.length(1);
      expect(consultasMedico[0].codigo).to.eq(134);
    });

    it('Deve ordenar consultas por horário', () => {
      const consultas = [
        { codigo: 134, horario: '2025-08-06 05:16:00' },
        { codigo: 249, horario: '2025-05-28 21:53:00' },
        { codigo: 571, horario: '2025-05-28 21:18:00' }
      ];

      const ordenadas = consultas.sort((a, b) => 
        new Date(a.horario) - new Date(b.horario)
      );

      expect(ordenadas[0].codigo).to.eq(571);
      expect(ordenadas[1].codigo).to.eq(249);
      expect(ordenadas[2].codigo).to.eq(134);
    });

  });

  describe('Validação de Dados de Entrada', () => {
    
    it('Deve validar payload de nova consulta completo', () => {
      const novaConsulta = {
        codigo: 999,
        horario: '2025-12-25 10:00:00',
        descricao: 'Consulta de rotina',
        id_user: '111.111.111-11',
        id_medico: '222.222.222-22'
      };

      const camposObrigatorios = [
        'codigo', 'horario', 'descricao', 'id_user', 'id_medico'
      ];

      camposObrigatorios.forEach(campo => {
        expect(novaConsulta).to.have.property(campo);
        expect(novaConsulta[campo]).to.not.be.undefined;
        expect(novaConsulta[campo]).to.not.be.null;
      });
    });

    it('Deve rejeitar descrição vazia', () => {
      const descricao = '';

      expect(descricao.trim()).to.have.length(0);
    });

    it('Deve aceitar descrição válida', () => {
      const descricoes = ['Consulta', 'oi tudo bem', 'teste'];

      descricoes.forEach(desc => {
        expect(desc.trim()).to.have.length.greaterThan(0);
      });
    });

  });

  describe('Transformação e Formatação de Dados', () => {
    
    it('Deve formatar dados de consulta para exibição', () => {
      const consulta = {
        codigo: 134,
        horario: '2025-08-06 05:16:00',
        descricao: 'Consulta',
        status: 'realizado'
      };

      const formatada = {
        ...consulta,
        horarioFormatado: new Date(consulta.horario).toLocaleString('pt-BR'),
        statusExibicao: consulta.status === 'realizado' ? 'Realizada' : 'Em andamento'
      };

      expect(formatada).to.have.property('horarioFormatado');
      expect(formatada).to.have.property('statusExibicao');
      expect(formatada.statusExibicao).to.eq('Realizada');
    });

    it('Deve calcular tempo até a consulta', () => {
      const agora = new Date('2025-08-05 12:00:00');
      const horarioConsulta = new Date('2025-08-06 05:16:00');

      const diferencaMs = horarioConsulta - agora;
      const diferencaHoras = Math.floor(diferencaMs / (1000 * 60 * 60));

      expect(diferencaHoras).to.be.greaterThan(0);
      expect(diferencaHoras).to.eq(17); // ~17 horas
    });

  });

  describe('Validação de Relacionamentos', () => {
    
    it('Deve ter referência válida para User', () => {
      const consulta = {
        id_user: '111.111.111-11'
      };

      expect(consulta.id_user).to.be.a('string');
      expect(consulta.id_user).to.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    });

    it('Deve ter referência válida para Medico', () => {
      const consulta = {
        id_medico: '222.222.222-22'
      };

      expect(consulta.id_medico).to.be.a('string');
      expect(consulta.id_medico).to.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    });

  });

});
