const express = require('express');
const peliculasRouter = require('./routes/peliculasRoutes.js');
const loginRouter = require('./routes/loginRoutes.js');
const bearer = require('express-bearer-token');
const verificarToken = require('./verificarToken.js');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT;

//SWAGGER
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use(bearer());
app.use(cors());


app.use(loginRouter);
app.use('/peliculas', verificarToken, peliculasRouter.router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req,res,next)=>{
    res.status(404).send("Error 404");
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
