import React, { Component } from 'react'
import Hello from '../Hello.js'
import './greeting.css'
 
class ClassGreeting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultName: 'Jenni',
        };
    }
 
    componentDidMount = () => { console.log('mount') }
 
    exampleMethode = () => { console.log('methode') }  
 
    render() {
        return(
            <div className="title">
                {(this.props.name !== '') 
                    ? <h2>Hey, {this.props.name}.</h2>
                    : <Hello name={this.state.defaultName} />
                }
            </div>
        )
    }
}
 
export default ClassGreeting;