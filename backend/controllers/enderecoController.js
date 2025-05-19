require('dotenv').config();
const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserEndereco = require('../models/userEnderecoModel');
const EnderecoMedico = require('../models/medicoEnderecoModel');