const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {

    app.get('/getTask', mid.requiresLogin, controllers.Task.getTask);  
    app.post('/todo', mid.requiresLogin, controllers.Task.addTask);

    app.delete('/todo/:id', mid.requiresLogin, controllers.Task.deleteTask);
    app.patch('/editTodo/:id', mid.requiresLogin, controllers.Task.updateTask);
    app.get('/todo', mid.requiresLogin, controllers.Task.makerPage);

    app.patch('/setDuration', mid.requiresLogin, controllers.Time.updateTime);
    app.get('/getTime', mid.requiresLogin, controllers.Time.getTime);

    app.get('/changePassword', controllers.Account.renderPasswordChangePage);
    app.patch('/changePassword', controllers.Account.changePassword);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

};

module.exports = router;