//handles signup and everything before user logs in 
const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendRequest(e.target.action, {username, pass}, 'POST');
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2){
        helper.handleError('All fields are required');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }
    helper.sendRequest(e.target.action, {username, pass, pass2}, 'POST');
    return false;
}

const changesPass = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#old-pass').value;
    const pass1 = e.target.querySelector('#pass-1').value;
    const pass2 = e.target.querySelector('#pass-2').value;

    if(!pass1 ||  !oldPass){
        helper.handleError('Enter the new password');
    }
    else{
        if(!pass2){
            helper.handleError('Retype the new password');
        }
    }
    if(pass1 !== pass2){
        helper.handleError('Password do not match!');
    }
    //sends a patch request
    helper.sendRequest(e.target.action, {oldPass, pass1, pass2}, 'PATCH');
    return false;
}

//creating react components - functional stateless component / FSC
const LoginWindow = (props) => {
    return (
        <form id='loginForm'
            name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm'
        >
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password'/>
            <input className='formSubmit' type='submit' value='Sign in'/>
        </form>
    );
};

const SignupWindow = (props) =>{
    return (
        <form id='signupForm'
            name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'
        >
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password' />
            <input className='formSubmit' type='submit' value='Sign up' />
        </form>
    );
};

const ChangePassword = () => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={changesPass}
            action='/changePassword'
            method='PATCH'
            className='changePassForm'
        >
            <label htmlFor='old-pass'>Enter the current password: </label>
            <input id='old-pass' type='password' name='old-pass' placeholder='Enter the current password' /> 

            <label htmlFor='pass-1'>Enter the new password: </label>
            <input id='pass-1' type='password' name='pass-1' placeholder='Enter new password'/> 

            <label htmlFor='pass-2'>Retype the new password: </label>
            <input id='pass-2' type='password' name='pass-2'placeholder='Enter the password again'/>
            <input className='formSubmit' type='submit' value='Update'></input>
        </form>
    )
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const changeButton = document.getElementById('changePassButton');

    const root = createRoot(document.getElementById('content'));
    
    changeButton.addEventListener('click', (e)=> {
        e.preventDefault();
        root.render(<ChangePassword />);
        return false;
    });
    //root.render(<ChangePassword />);
    
    loginButton.addEventListener('click', (e)=> {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });
};
window.onload = init;

