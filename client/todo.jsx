//responsible for tracking user status i.e. logged in
const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');
const {Clock} = require('./timer.jsx');
const {ChangePassword, changePasscodeUI} = require('./login.jsx');

export const handleTodo = (e, onTaskAdded) => {
    e.preventDefault();
    const task = e.target.querySelector('#task').value;

    if(!task){
        helper.handleError('All fields are required!');
        return false;
    }
    helper.sendRequest(e.target.action, {task}, 'POST', onTaskAdded);
     e.target.querySelector('#task').value = '';
    return false;
};

//allows users to add their todos
const TodoForm = (props) => {
    return (
        <form id='todoForm'
            class='todoForms'
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

//allows users to edit their tasks
const EditTodoForm = (props) => {
    return (
        <form id='editForm'
            class='todoForms'
            onSubmit={(e) => {
                e.preventDefault();
                const newTask = e.target.querySelector('#editTask').value;
                if(newTask) props.onSubmit(newTask);
            }}
            name='editForm'
            action='/editTodo'
            method='PATCH'
            className='todoForm'>
                <label htmlFor='task'>Edit task: </label>
                <input id='editTask' type='text' name='task' placeholder='Task'/>
                <input className='submitTodo' type='submit' value='Submit' />
            </form>
    );
};

//keeps tracks of all the todos and renders if a new one is added
const TodoList = (props) => {
    const [todos, setTodo] = useState(props.todo);  

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTask');
            const data = await response.json();
            setTodo(data.tasks);    
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);    

    if(!todos || todos.length === 0){
        return (
            <div className='todoList'>
                <h3 className='empty'>You're all caught up!</h3>
            </div>
        );
    }
    
    //Keeps track of edits, completion and deletion and triggers response
    const TodoItem = ({todo, triggerReload}) => {
        const [completed, setCompleted] = useState(false);
        const [edited, setEdit] = useState(false);

        const handleDelete = async () => {
            const response = await fetch(`/todo/${todo._id}`, {
                method: 'DELETE',
            });
            if(response.status === 204)
                triggerReload();
        };

        const updateTodo = async (newTask) => {
            const taskJson = JSON.stringify({task: newTask});
            const response = await fetch(`/editTodo/${todo._id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: taskJson,
            });
            if(response.status === 204){
                triggerReload();
            }
        }
       
        //JSX elements for the same
        return (
            <div className='todo'>
                <h3 style={{
                    textDecoration: completed? 'line-through': 'none',
                }}>{todo.task}</h3>
                <button class="todoBtn" onClick={()=>setCompleted(!completed)}>{completed? 'Undo': 'Done'}</button>
                <button class="todoBtn" onClick={handleDelete}>Remove</button>
                <button class="todoBtn" onClick={() => setEdit(!edited)}>Edit</button>

                {edited && (<EditTodoForm onSubmit={(newTask) => {
                    updateTodo(newTask);
                    setEdit(false);
                }}
                />)}
            </div>
        );
    }

    //Renders all the elements from todos array
    const todo = todos.map(todo => {
        return (
            <TodoItem key={todo._id} todo={todo} triggerReload={props.triggerReload}/>
        );
    });
    return (
        <div className='taskList'>
            {todo}
        </div>
    );
};

//keeping track of the submit button and every time the user triggers, it reloads the doms
//this should go in a separate class
const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);
    return (
        <>
            <Clock reloadTime={reloadTasks} triggerReload={() => setReloadTasks(!reloadTasks)} />
            <div id='addTodo'>
                <TodoForm triggerReload={() => setReloadTasks(!reloadTasks)}/>
            </div>
            <div id='todo'>
                <TodoList todo={[]} reloadTasks={reloadTasks} triggerReload={() => setReloadTasks(!reloadTasks)} />
            </div>
        </>
    );
};

//loads changePass, todo and clock elements when the page is first loaded
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
    changePasscodeUI(root);
};

window.onload = init;
