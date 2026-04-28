//responsible for tracking user status i.e. logged in
const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');
const {Clock} = require('./timer.jsx');

//Sample code from repository
export const handleTodo = (e, onTaskAdded) => {
    e.preventDefault();
    helper.hideError();

    const task = e.target.querySelector('#task').value;

    if(!task){
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, {task}, onTaskAdded);
     e.target.querySelector('#task').value = '';
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

const EditTodoForm = (props) => {
    return (
        <form id='editForm'
            onSubmit={(e) => {
                e.preventDefault();
                const newTask = e.target.querySelector('#editTask').value;
                if(newTask) props.onSubmit(newTask);
                console.log(newTask);
            }}
            name='editForm'
            action='/editTodo'
            method='PATCH'
            className='todoForm'>
                <label htmlFor='task'>Task: </label>
                <input id='editTask' type='text' name='task' placeholder='Task'/>
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
    }, [props.reloadTasks]);    

    if(!todos || todos.length === 0){
        return (
            <div className='todoList'>
                <h3 className='empty'>You're all caught up!</h3>
            </div>
        );
    }

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
            //console.log(`/editTodo/${todo._id}`);
            const taskJson = JSON.stringify({task: newTask});
            //console.log(taskJson);
            const response = await fetch(`/editTodo/${todo._id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: taskJson,
            });
            if(response.status === 204){
                triggerReload();
            }
        }
       
        //broken transistion
        return (
            <div className='todo'>
                <h3 style={{
                    textDecoration: completed? 'line-through': 'none',
                }}>{todo.task}</h3>
                <button onClick={()=>setCompleted(!completed)}>{completed? 'Undo': 'Done'}</button>
                <button onClick={handleDelete}>Remove</button>
                <button onClick={() => setEdit(!edited)}>Edit</button>

                {edited && (<EditTodoForm onSubmit={(newTask) => {
                    console.log(newTask);
                    updateTodo(newTask);
                    setEdit(false);
                }}
                />)}
            </div>
        );
    }

    const todo = todos.map(todo => {
        return (
            <TodoItem key={todo._id} todo={todo} triggerReload={props.triggerReload}/>
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
//this should go in a separate class
const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);
    return (
        <>
            <Clock />
            <div id='addTodo'>
                <TodoForm triggerReload={() => setReloadTasks(!reloadTasks)}/>
            </div>
            <div id='todo'>
                <TodoList todo={[]} reloadTasks={reloadTasks} triggerReload={() => setReloadTasks(!reloadTasks)} />
            </div>
        </>
    );
};



const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
