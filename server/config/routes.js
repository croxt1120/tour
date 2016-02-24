module.exports = function(app) {
    app.use('/test', require('../api/test'));
};