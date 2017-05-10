module.exports = function(app) {
    app.use('/tour', require('../routes/tour'));
    app.use('/file', require('../routes/file'));
};