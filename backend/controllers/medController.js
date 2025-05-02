require('dotenv').config();
const Medico = require('../models/medModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req,res,next) => {
    try {
        const { email, password } = req.body;

        let testeUserEncontrado = await Medico.findOne({ where: { email } });
        if (testeUserEncontrado) {
          return res.json({ success: false, message: 'Este usuario já existe!' });
        }
        const senhaEncrypt = await bcrypt.hash(password, 10);
        await Medico.create({ email, password: senhaEncrypt, approved: false }); // utilizado para salvar o usuario 
         return res.status(201).json({ message: 'Usuario registrado com sucesso.' });
        } catch (error) {
        return res.status(500).json(error,{ error: 'Algo falhou.' });
    }
}

exports.login = async(req,res,next) => {
    const { email, password, approved } = req.body
    let testeUserEncontrado = await Medico.findOne({where: { 'email': email }});
    if (testeUserEncontrado && approved == true) {
        const passwordMatch = await bcrypt.compare(password, testeUserEncontrado.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha incorreta.' });
            }
        const token = jwt.sign({ id: testeUserEncontrado.id }, process.env.SECRET_KEY, {
                expiresIn: '1h',
                });
        res.status(200).json({ token });
      }
    if (!testeUserEncontrado) {
        return res.status(401).json({ error: 'Login inexistente.' });
    }
}