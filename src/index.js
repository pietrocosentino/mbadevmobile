const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    swaggerUi = require('swagger-ui-express'),
    YAML = require('yamljs'),
    logger = require('./config/logger'),
    config = require('./config/config'),
    routes = require('./app/routes/routes');

const specs = YAML.load("src/config/swagger.yml");

const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

routes(app);
app.listen(config.PORT, () => {
    logger.info(`URLShortener running on port ${config.PORT}`);
});