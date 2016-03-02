module.exports = function(app) {
    app.use('/test', require('../routes/test'));
    app.use('/code', require('../routes/code'));
};