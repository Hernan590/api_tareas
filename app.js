const { PORT } = require('./config/config.js');
const express = require('express');
const cors = require('cors');
const keepActiveBd = require('./services/dbPing.js')

const app = express();
const port = PORT;

app.use(express.json());
app.use(cors());

const v1 = express.Router();
v1.use('/login/', require('./routes/v1/login'))
v1.use('/usuarios', require('./routes/v1/usuarios'))
v1.use('/tareas', require('./routes/v1/tareas'))

app.use('/v1', v1);

keepActiveBd();
setInterval(keepActiveBd, 2 * 60 * 60 * 1000);

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`);
});