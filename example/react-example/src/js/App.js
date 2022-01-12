import React from 'react'
import ClassGreeting from './components/class/ClassGreeting.js'
import FunctionalGreeting from './components/functional/FunctionalComponent.js'
import store from '../redux/store.js'
import { increment, reset } from '../redux/actions/counter.js'
import { connect } from "react-redux";

function App(props) {
    const name = 'Thomas Schulz';
    
    const element = <h1>Hello, {name} in JSX.</h1>;

    const incrementCount = () => {
        console.log("increment")
        store.dispatch(increment())
    }

    const resetCount = () => {
        console.log("reset")
        store.dispatch(reset())
        // store.dispatch(reset)
    }

    return (
        <div>
            <p>Class Component</p>
            <ClassGreeting name='Jack' />

            <p>Functional Component</p>
            <FunctionalGreeting name='' />

            <p>Redux</p>
            <p>Count: {props.count}</p>
            <button onClick={incrementCount}>+</button>
            <button onClick={resetCount}>Reset</button>

            <p>JSX</p>
            {element}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        count: state.counter.count
    };
};

export default connect(mapStateToProps)(App);