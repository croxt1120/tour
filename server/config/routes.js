module.exports = function(app) {
    app.use('/test', require('../api/test'));
    app.use('/code', require('../api/code'));
};