//responsible for tracking user status i.e. logged in
const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTodo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const task = e.target.querySelector('#task').value;

    if(!task){
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, {task}, onDomoAdded);
    return false;
};
//functional component
const todoForm = (props) => {
    return (
        <form id='todoForm'
            onSubmit={(e) => handleTodo(e, props.triggerReload)}
            name='todoForm'
            action='/todo'
            method='POST'
            className='todoForm'>
                <label htmlFor='task'>Task: </label>
                <input id='task' type='text' name='task' placeholder='Task'/>
                <input className='submitTodo' type='submit' value='Submit' />
            </form>
    );
};

const todoList = (props) => {
    const [todos, setTodo] = useState(props.todo);  //todos is an array

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTask');
            const data = await response.json();
            setTodo(data.tasks);    //new thing
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);    //reload domos? 

    if(todos.length === 0){
        return (
            <div className='todoList'>
                <h3 className='noTodo'>You're all caught up!</h3>
            </div>
        );
    }

    const todo = todos.map(todo => {
        return (
            <div key={todo.id} className='todo'>
                <h3 className='task'>{todo.task}</h3>
            </div>
        );
    });

    //renders every single element in the list
    return (
        <div className='taskList'>
            {todo}
        </div>
    );
};

//keeping track of the submit button and every time the user triggers, it reloads the doms
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='addTask'>
                <todoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <todoList todo={[]} reloadTasks={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
