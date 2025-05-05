const express = require('express');
const app = express();
const routes = require('./routes');
const database = require('./db/database')
const cookieParser = require('cookie-parser')
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // ou seu frontend (ex: http://localhost:3000)
  credentials: true // permite cookies serem enviados
}));
app.use(express.json());
app.use(routes);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
