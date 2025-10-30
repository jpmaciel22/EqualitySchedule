// 📁 Caminho: cypress/e2e/frontend/app.cy.js

describe('Testes Frontend - EOG SCHEDULE', () => {
  const baseUrl = 'http://localhost:4200';
  const apiUrl = 'http://localhost:3000';

  // Token JWT fake para simular autenticação
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNwZiI6IjExMS4xMTEuMTExLTExIiwibm9tZSI6Ikpvw6NvIFNpbHZhIiwiZW1haWwiOiJqb2FvQHRlc3RlLmNvbSIsInR5cGUiOiJjbGllbnRlIn0sImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {
    // Limpa estado antes de cada teste
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // ============================================
  // TESTE 1: Registro de novo usuário (Cliente)
  // ============================================
  it('Deve registrar um novo cliente com sucesso', () => {
    cy.visit(`${baseUrl}/register`);

    // Preenche o formulário de registro
    cy.get('input[name="email"]').type('novocliente@teste.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="nome"]').type('Maria Santos');
    cy.get('input[name="cpf"]').type('444.444.444-44');
    cy.get('input[name="telefone"]').type('71999887766');
    cy.get('select[name="select"]').select('cliente');

    // Intercepta a requisição de registro
    cy.intercept('POST', `${apiUrl}/login/register`, {
      statusCode: 201,
      body: {
        success: true,
        message: 'Usuário registrado com sucesso'
      }
    }).as('registerRequest');

    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a requisição foi feita corretamente
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.request.body).to.deep.include({
        email: 'novocliente@teste.com',
        typeUser: 'cliente',
        nome: 'Maria Santos',
        cpf: '444.444.444-44'
      });
    });

    // Verifica redirecionamento para login
    cy.url().should('include', '/login');
  });

  // ============================================
  // TESTE 2: Registro de médico com campos extras
  // ============================================
  it('Deve registrar um novo médico com região e especialização', () => {
    cy.visit(`${baseUrl}/register`);

    cy.get('input[name="email"]').type('medico@teste.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="nome"]').type('Dr. Carlos');
    cy.get('input[name="cpf"]').type('555.555.555-55');
    cy.get('input[name="telefone"]').type('71988776655');
    cy.get('select[name="select"]').select('medico');

    // Campos extras aparecem para médico
    cy.get('input[name="regiao"]').should('be.visible');
    cy.get('input[name="especificacao"]').should('be.visible');

    cy.get('input[name="regiao"]').type('Salvador');
    cy.get('input[name="especificacao"]').type('Cardiologia');

    cy.intercept('POST', `${apiUrl}/login/register`, {
      statusCode: 201,
      body: { success: true, message: 'Médico registrado' }
    }).as('registerMedico');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerMedico').then((interception) => {
      expect(interception.request.body).to.deep.include({
        typeUser: 'medico',
        regiao: 'Salvador',
        especificacao: 'Cardiologia'
      });
    });

    cy.url().should('include', '/login');
  });

  // ============================================
  // TESTE 3: Login e visualização de consultas
  // ============================================
  it('Deve fazer login e exibir consultas do cliente organizadas por status', () => {
    // Intercepta login ANTES do visit
    cy.intercept('POST', `${apiUrl}/login/`, {
      statusCode: 200,
      body: {
        success: true,
        token: fakeToken,
        message: 'Login realizado'
      }
    }).as('loginRequest');

    cy.visit(`${baseUrl}/login`);

    // Preenche login
    cy.get('input[name="email"]').type('cliente@teste.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('select[name="select"]').select('cliente');

    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // Verifica se redirecionou para home
    cy.url().should('eq', `${baseUrl}/`);

    // Mock das consultas retornadas pela API (ANTES do visit)
    const hoje = new Date().toISOString().split('T')[0];
    const amanha = new Date(Date.now() + 86400000).toISOString();
    
    cy.intercept('POST', `${apiUrl}/tasks/`, {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            codigo: 1001,
            horario: `${hoje}T10:00:00`,
            descricao: 'Consulta de hoje',
            status: 'em-andamento',
            medico_nome: 'Dr. Silva',
            medico_especializacao: 'Cardiologia'
          },
          {
            codigo: 1002,
            horario: amanha,
            descricao: 'Consulta futura',
            status: 'em-andamento',
            medico_nome: 'Dra. Costa',
            medico_especializacao: 'Pediatria'
          },
          {
            codigo: 1003,
            horario: '2025-10-01T14:00:00',
            descricao: 'Consulta realizada',
            status: 'realizado',
            medico_nome: 'Dr. Santos',
            medico_especializacao: 'Ortopedia'
          }
        ]
      }
    }).as('getTasks');

    // Navega para tasks (DEPOIS do intercept)
    cy.visit(`${baseUrl}/tasks`);

    cy.wait('@getTasks');

    // Verifica se as seções aparecem
    cy.contains('Suas consultas').should('be.visible');
    cy.contains('Realizadas').should('be.visible');
    cy.contains('Pendentes').should('be.visible');

    // Verifica se consulta de hoje aparece
    cy.contains('Consulta de hoje').should('be.visible');
    cy.contains('Dr. Silva').should('be.visible');

    // Verifica se consulta realizada aparece na seção correta
    cy.contains('Consulta realizada').should('be.visible');
  });

  // ============================================
  // TESTE 4: Criar nova consulta completo
  // ============================================
  it('Deve criar uma nova consulta selecionando médico da lista', () => {
    // Simula usuário logado
    cy.window().then((win) => {
      win.localStorage.setItem('token', fakeToken);
    });

    // Mock da lista de médicos (ANTES do visit)
    cy.intercept('GET', `${apiUrl}/tasks/getMedicos`, {
      statusCode: 200,
      body: {
        data: [
          { cpf: '222.222.222-22', nome: 'Dr. Silva', especificacao: 'Cardiologia' },
          { cpf: '333.333.333-33', nome: 'Dra. Costa', especificacao: 'Pediatria' },
          { cpf: '444.444.444-44', nome: 'Dr. Santos', especificacao: 'Ortopedia' }
        ]
      }
    }).as('getMedicos');

    cy.visit(`${baseUrl}/tasks/new-task`);

    cy.wait('@getMedicos');

    // Preenche formulário de nova consulta
    cy.get('input[name="data"]').type('2025-12-31T15:30');
    cy.get('textarea[name="descricao"]').type('Consulta de retorno importante');
    
    // Seleciona médico pelo TEXTO (nome - especialização)
    cy.get('select[name="select"]').select('Dr. Silva - Cardiologia');

    // Intercepta criação
    cy.intercept('POST', `${apiUrl}/tasks/add`, {
      statusCode: 201,
      body: {
        success: true,
        message: 'Consulta registrada com sucesso.'
      }
    }).as('criarConsulta');

    cy.get('button[type="submit"]').click();

    cy.wait('@criarConsulta').then((interception) => {
      expect(interception.request.body).to.include({
        descricao: 'Consulta de retorno importante',
        medico_cpf: '222.222.222-22',
        data: '2025-12-31T15:30'
      });
      expect(interception.request.body.codigo).to.be.a('number');
      expect(interception.request.body.user).to.exist;
    });

    // Verifica mensagem de sucesso
    cy.contains('Consulta registrada com sucesso').should('be.visible');
  });

  // ============================================
  // TESTE 5: Marcar consulta como realizada
  // ============================================
  it('Deve marcar consulta como realizada e atualizar a interface', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', fakeToken);
    });

    const hoje = new Date().toISOString().split('T')[0];

    // Mock inicial com consulta em andamento (ANTES do visit)
    cy.intercept('POST', `${apiUrl}/tasks/`, {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            codigo: 2001,
            horario: `${hoje}T10:00:00`,
            descricao: 'Consulta para marcar',
            status: 'em-andamento',
            medico_nome: 'Dr. Silva',
            medico_especializacao: 'Cardiologia'
          }
        ]
      }
    }).as('getTasksInicial');

    cy.visit(`${baseUrl}/tasks`);

    cy.wait('@getTasksInicial');

    // Verifica que a consulta aparece na seção de hoje
    cy.contains('Consulta para marcar').should('be.visible');

    // Intercepta a marcação como realizada
    cy.intercept('POST', `${apiUrl}/tasks/realizar`, {
      statusCode: 201,
      body: {
        success: true,
        message: 'Consulta atualizada'
      }
    }).as('marcarRealizada');

    // Mock atualizado após marcar como realizada
    cy.intercept('POST', `${apiUrl}/tasks/`, {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            codigo: 2001,
            horario: `${hoje}T10:00:00`,
            descricao: 'Consulta para marcar',
            status: 'realizado',
            medico_nome: 'Dr. Silva',
            medico_especializacao: 'Cardiologia'
          }
        ]
      }
    }).as('getTasksAtualizado');

    // Clica no botão "Realizada"
    cy.contains('button', 'Realizada').click();

    cy.wait('@marcarRealizada').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        codigo: 2001
      });
    });

    // Aguarda reload da lista
    cy.wait('@getTasksAtualizado');

    // Verifica que consulta agora aparece na seção de realizadas
    cy.contains('.status-column', 'Realizadas').within(() => {
      cy.contains('Consulta para marcar').should('be.visible');
    });
  });

  // ============================================
  // TESTE BÔNUS: Cadastrar endereço
  // ============================================
  it('Deve cadastrar um endereço com sucesso', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', fakeToken);
    });

    cy.visit(`${baseUrl}/register/endereco`);

    cy.get('input[name="rua"]').type('Rua das Flores, 123');
    cy.get('input[name="cidade"]').type('Salvador');
    cy.get('input[name="estado"]').type('BA');

    cy.intercept('POST', `${apiUrl}/endereco`, {
      statusCode: 201,
      body: {
        success: true,
        message: 'Endereço cadastrado com sucesso'
      }
    }).as('cadastrarEndereco');

    cy.get('button[type="submit"]').click();

    cy.wait('@cadastrarEndereco').then((interception) => {
      expect(interception.request.body).to.deep.include({
        rua: 'Rua das Flores, 123',
        cidade: 'Salvador',
        estado: 'BA',
        typeUser: 'cliente',
        cpf: '111.111.111-11'
      });
    });

    // Verifica mensagem de sucesso
    cy.get('ngb-alert[type="success"]').should('be.visible');
    cy.contains('Endereço cadastrado com sucesso').should('be.visible');
  });
});