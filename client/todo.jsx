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
const TodoForm = (props) => {
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

const TodoList = (props) => {
    const [todos, setTodo] = useState(props.todo);  //todos is an array

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTask');
            const data = await response.json();
            setTodo(data.tasks);    //new thing
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);    //reload domos? 

    if(!todos || todos.length === 0){
        return (
            <div className='todoList'>
                <h3 className='empty'>You're all caught up!</h3>
            </div>
        );
    }

    const TodoItem = ({todo}) => {
        const [completed, setCompleted] = useState(false);

        return (
            <div className='todo'>
                <h3 style={{
                    textDecoration: completed? 'line-through': 'none',
                    transition: 'all 0.5s ease',
                    alignSelf:completed? 'flex-end' : 'flex-start',
                }}>{todo.task}</h3>
                <button onClick={()=>setCompleted(!completed)}>{completed? 'Undo': 'Done'}</button>
                <button>Remove</button>
            </div>
        );
    }

    const todo = todos.map(todo => {
        return (
            <TodoItem key={todo.id} todo={todo}/>
        );
    });

    //renders every single element in the list
    return (
        <div className='taskList'>
            {todo}
        </div>
    );
};

const Greet = () =>{
    return <form id='todoForm'
            name='todoForm'
            action='/todo'
            method='POST'
            className='todoForm'>
                <label htmlFor='task'>Task: </label>
                <input id='task' type='text' name='task' placeholder='Task'/>
                <input className='submitTodo' type='submit' value='Submit' />
            </form>;
}

//keeping track of the submit button and every time the user triggers, it reloads the doms
const App = () => {
    //const [reloadDomos, setReloadDomos] = useState(false);
    const [reloadTasks, setReloadTasks] = useState(false);
    return (
        <>
            <div id='addTodo'>
                <TodoForm triggerReload={() => setReloadTasks(!reloadTasks)}/>
            </div>
            <div id='todo'>
                <TodoList todo={[]} reloadTasks={reloadTasks}/>
            </div>
        </>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
