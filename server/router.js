const controllers = require('./controllers');
const { renderWelcome } = require('./controllers/Account');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getTask', mid.requiresLogin, controllers.Task.getTask);  
    app.post('/todo', mid.requiresLogin, controllers.Task.addTask);

    app.delete('/todo/:id', mid.requiresLogin, controllers.Task.deleteTask);
    app.patch('/editTodo/:id', mid.requiresLogin, controllers.Task.updateTask);
    app.get('/todo', mid.requiresLogin, controllers.Task.makerPage);

    app.post('/postDuration', controllers.Time.updateTime);
    app.patch('/postDuration', controllers.Time.updateTime);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/about', mid.requiresLogin, renderWelcome);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;