const { PORT, DB_HOST } = require('./config/config.js');
const express = require('express');
const cors = require('cors');

const app = express();
const port = PORT;
const hostname = DB_HOST;

app.use(express.json());
app.use(cors());

const v1 = express.Router();
v1.use('/login/', require('./routes/v1/login'))
v1.use('/usuarios', require('./routes/v1/usuarios'))
v1.use('/tareas', require('./routes/v1/tareas'))

app.use('/v1', v1);

app.listen(port, hostname, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`);
});