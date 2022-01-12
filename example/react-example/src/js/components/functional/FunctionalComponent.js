import React, {useState, useEffect} from 'react' 
import Hello from '../Hello'
import './greeting.css'
 
function FunctionalGreeting(props) {
    const [defaultName, setDefaultName] = useState('Jenni')
 
    useEffect (() => { console.log('useEffect with empty array') }, [])
    useEffect (() => { console.log('useEffect with default name') }, [defaultName])
 
 
    const exampleMethode = () => { console.log('methode') }
 
    return(
        <div className="title">
            {(props.name !== '') 
                ? <h2>Hey, {props.name}.</h2>
                : <Hello name={defaultName} />
            }
        </div>
    )
}  
 
export default FunctionalGreeting; 