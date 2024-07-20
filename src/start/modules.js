const routes = require('../routes');
const errorHandler = require('../middlewares/error-handler.middleware');

const modules = (app, express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', routes);

    app.use(errorHandler);
}

module.exports = modules;
