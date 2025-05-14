require('dotenv').config();
const express = require('express');
const User = require('../models/loginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Medico = require('../models/medModel');

exports.register = async (req, res, next) => {
  try {
    const { email, password, typeUser, nome, cpf, telefone, regiao} = req.body;
    if (typeUser == 'cliente') {
      const testeUserEncontrado = await User.findOne({ where: { email } });
      if (testeUserEncontrado) {
        return res.json({ success: false, message: 'Este usuario já existe!' });
      }
      const senhaEncrypt = await bcrypt.hash(password, 10);
      await User.create({ email, password: senhaEncrypt, nome, cpf, telefone }); // utilizado para salvar o usuario 
      return res.status(201).json({ success: true, message: 'Usuario registrado com sucesso.' });
    }
    if (typeUser == 'medico') {
      const testeUserEncontrado = await Medico.findOne({ where: { email } });
      if (testeUserEncontrado) {
        return res.json({ success: false, message: 'Médico já existe!' });
      }
      const senhaEncrypt = await bcrypt.hash(password, 10);
      await Medico.create({ email, password: senhaEncrypt, nome, cpf, telefone, regiao  });
      return res.status(201).json({ success: true, message: 'Médico registrado com sucesso.' });
    }
    return res.status(400).json({ success: false, message: 'Tipo de usuário inválido.' });
  } catch (error) {
    console.log(req.body)
    return res.status(500).json(error, { success: false ,message: 'Algo falhou.' });
  }
}

exports.login = async (req, res, next) => {
  const { email, password, typeUser } = req.body
  if (typeUser === 'cliente') {
    let testeUserEncontrado = await User.findOne({ where: { 'email': email } });
    if (testeUserEncontrado) {
      const passwordMatch = await bcrypt.compare(password, testeUserEncontrado.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
      // const token = jwt.sign({ id: testeUserEncontrado.id }, process.env.SECRET_KEY, {
      //   expiresIn: '1h',
      // }); // functional JWT
      const payload = {
        nome: testeUserEncontrado.nome,
        cpf: testeUserEncontrado.cpf,
        email: testeUserEncontrado.email,
        type: typeUser
      };
      const token = jwt.sign( { payload }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
    if (!testeUserEncontrado) {
      return res.status(401).json({ success: false, message: 'Usuário inexistente.' });
    }
  }
  if (typeUser === 'medico') {
    let testeUserEncontrado = await Medico.findOne({ where: { 'email': email } });
    if (testeUserEncontrado) {
      const passwordMatch = await bcrypt.compare(password, testeUserEncontrado.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
      const payload = {
        nome: testeUserEncontrado.nome,
        cpf: testeUserEncontrado.cpf,
        email: testeUserEncontrado.email,
        type: typeUser
      };
      const token = jwt.sign( { payload }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
    if (!testeUserEncontrado) {
      return res.status(401).json({ success: false, message: 'Usuário inexistente.' });
    }
  }
  else{console.log('Erro: ',res)}
}