const Disponibilidade = require('../models/disponibilidadeModel');
const Consulta = require('../models/consultaModel');
require('dotenv').config();

// Função auxiliar para gerar slots de 30 minutos
function gerarSlots(horaInicio, horaFim) {
  const slots = [];
  const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
  const [horaFimH, horaFimM] = horaFim.split(':').map(Number);

  let horaAtual = horaInicioH * 60 + horaInicioM; // Converter para minutos
  const horaFimTotal = horaFimH * 60 + horaFimM;

  while (horaAtual < horaFimTotal) {
    const proxHora = horaAtual + 30; // Slot de 30 minutos

    const inicioH = Math.floor(horaAtual / 60).toString().padStart(2, '0');
    const inicioM = (horaAtual % 60).toString().padStart(2, '0');
    const fimH = Math.floor(proxHora / 60).toString().padStart(2, '0');
    const fimM = (proxHora % 60).toString().padStart(2, '0');

    slots.push({
      hora_inicio: `${inicioH}:${inicioM}:00`,
      hora_fim: `${fimH}:${fimM}:00`,
    });

    horaAtual = proxHora;
  }

  return slots;
}

// Criar disponibilidade (médico define seus horários)
exports.criarDisponibilidade = async (req, res, next) => {
  try {
    const { medico_cpf, data_inicio, data_fim, horarios } = req.body;
    // horarios: [{ hora_inicio: "08:00", hora_fim: "12:00" }, ...]

    if (!medico_cpf || !data_inicio || !data_fim || !horarios || horarios.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos.' 
      });
    }

    // Gerar disponibilidades para cada dia no período
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    const disponibilidades = [];

    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      const dataFormatada = d.toISOString().split('T')[0]; // YYYY-MM-DD
      
      for (let horario of horarios) {
        // Gerar slots de 30 minutos dentro do range
        const slots = gerarSlots(horario.hora_inicio, horario.hora_fim);
        
        for (let slot of slots) {
          disponibilidades.push({
            id_medico: medico_cpf,
            data: dataFormatada,
            hora_inicio: slot.hora_inicio,
            hora_fim: slot.hora_fim,
            disponivel: true,
          });
        }
      }
    }

    await Disponibilidade.bulkCreate(disponibilidades);

    return res.status(201).json({ 
      success: true, 
      message: 'Disponibilidades criadas com sucesso!',
      total: disponibilidades.length
    });

  } catch (error) {
    console.error('Erro ao criar disponibilidade:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar disponibilidade',
      error: error.message 
    });
  }
};

// Buscar disponibilidades de um médico
exports.getDisponibilidades = async (req, res, next) => {
  try {
    const { medico_cpf } = req.body;

    if (!medico_cpf) {
      return res.status(400).json({ 
        success: false, 
        message: 'CPF do médico é obrigatório.' 
      });
    }

    const disponibilidades = await Disponibilidade.findAll({
      where: { 
        id_medico: medico_cpf,
        data: { 
          [require('sequelize').Op.gte]: new Date() // Apenas datas futuras
        }
      },
      order: [['data', 'ASC'], ['hora_inicio', 'ASC']]
    });

    return res.status(200).json({ 
      success: true, 
      data: disponibilidades 
    });

  } catch (error) {
    console.error('Erro ao buscar disponibilidades:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar disponibilidades' 
    });
  }
};

// Buscar horários disponíveis de um médico para uma data específica
exports.getHorariosDisponiveis = async (req, res, next) => {
  try {
    const { medico_cpf, data } = req.body;

    if (!medico_cpf || !data) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos.' 
      });
    }

    // Buscar disponibilidades do médico naquela data
    const disponibilidades = await Disponibilidade.findAll({
      where: { 
        id_medico: medico_cpf,
        data: data,
        disponivel: true
      },
      order: [['hora_inicio', 'ASC']]
    });

    // Buscar consultas já agendadas naquela data
    const dataInicio = `${data}T00:00:00`;
    const dataFim = `${data}T23:59:59`;

    const consultasAgendadas = await Consulta.findAll({
      where: {
        id_medico: medico_cpf,
        horario: {
          [require('sequelize').Op.between]: [dataInicio, dataFim]
        }
      }
    });

    // Filtrar horários que já foram ocupados
    const horariosOcupados = consultasAgendadas.map(c => {
      const hora = new Date(c.horario);
      return `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`;
    });

    const horariosLivres = disponibilidades.filter(d => {
      return !horariosOcupados.includes(d.hora_inicio.substring(0, 5));
    });

    return res.status(200).json({ 
      success: true, 
      data: horariosLivres 
    });

  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar horários disponíveis' 
    });
  }
};

// Deletar disponibilidade
exports.deletarDisponibilidade = async (req, res, next) => {
  try {
    const { id_disponibilidade } = req.body;

    if (!id_disponibilidade) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID da disponibilidade é obrigatório.' 
      });
    }

    await Disponibilidade.destroy({ where: { id_disponibilidade } });

    return res.status(200).json({ 
      success: true, 
      message: 'Disponibilidade deletada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao deletar disponibilidade:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao deletar disponibilidade' 
    });
  }
};