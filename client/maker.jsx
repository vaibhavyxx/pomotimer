//responsible for tracking user status i.e. logged in
const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const creature = e.target.querySelector('#domoCreature').value;

    if(!name || !age || !creature){
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, {name, age, creature}, onDomoAdded);
    return false;
};
//functional component
const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'>
                <label htmlFor='name'>Name: </label>
                <input id='domoName' type='text' name='name' placeholder='Domo Name'/>
                <label htmlFor='age'>Age: </label>
                <input id='domoAge' type='number' min='0' name='age' placeholder='Domo Age' />
                <label htmlFor='creature'>Creature: </label>
                <input id='domoCreature' type='text' name='creature' placeholder='Domo Creature'/>
                <input className='makeDomoSubmit' type='submit' value='Make Domo' />
            </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoCreature'>Creature: {domo.creature}</h3>
            </div>
        );
    });

    //renders every single element in the list
    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

//keeping track of the submit button and every time the user triggers, it reloads the doms
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='makeDomo'>
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
