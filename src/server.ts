require('dotenv').config();

import express from 'express';
import jwt from 'jsonwebtoken';

import authMiddleware from './middlewares/auth';

const app = express();
const port = process.env.PORT || 3333;

const login = {
  id: process.env.ID,
  user: String(process.env.USERNAME),
  senha: String(process.env.PASSWORD)
}

const secret = String(process.env.SECRET);

function generateToken(params = {}) {
  return jwt.sign({ id: login.id }, secret, {
    expiresIn: 86400
  })
}

app
.use(express.json())
.post('/authenticate', async (req, res) => {
  const { user, senha } = req.body;

  if (user != login.user) {
    return res.status(400).json({
      error: 'Username not found'
    })
  }

  if (senha != login.senha) {
    return res.status(400).json({
      error: 'Password incorrect'
    })
  }

  return res.status(200).json({
    login,
    token: generateToken({ id: login.id })
  })
})
.use(authMiddleware)
.get('/fruits', (req, res) => {
  return res.status(200).json({ message: "Você chegou aqui" })
})
.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
