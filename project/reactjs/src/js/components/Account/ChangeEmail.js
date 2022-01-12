import React, { useState } from 'react'
import Axios from 'axios'
import { changeEmailConstraints } from '../../helpers/Validation/validation.js'
const validate = require('validate.js')

function ChangeEmail() {
    const [validationResult, setValidationResult] = useState({})
    const [buttonIsLoading, setbuttonIsLoading] = useState(false)

    const sendForm = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setbuttonIsLoading(true)

        let email = document.getElementById('email').value

        let validation = validate({
            email: email
        }, changeEmailConstraints)

        if(validation !== undefined) {         
            setValidationResult(validation)
        }

        if(validation === undefined) {
            let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 
            let formData = {
                email
            }

            Axios
            .post('http://localhost:8000/dashboard/user/email', formData, headers)
            .then((res) => {
                if(res.data.success) {
                    setValidationResult({message: [res.data.message]})
                    document.getElementById('name').value = email 
                    document.getElementById('email').value = '' 
                }
                setbuttonIsLoading(false)
            })
            .catch((err) => {
                if(err.response.data.err !== undefined) {
                    setValidationResult({message: [err.response.data.err]})
                }
                setbuttonIsLoading(false)
            })
        }
        else {
            setbuttonIsLoading(false)
        }
    }

    return (
        <div className="flex-container-column margin20">
            <form className="form-width">
                <div>
                    <div className="form-group">  
                        <input className="form-control" type="text" name="email" id="email" placeholder="New E-Mail"/>
                        <label className="form-label" htmlFor="name">New E-Mail</label>
                    </div>                    
                </div>
            </form>

            <div className="form-error-message-container">
                { validationResult.email !== undefined && 
                    <p className="form-error-message margin20">{validationResult.email[0]}</p>
                } 
                { validationResult.message !== undefined && 
                    <p className="form-error-message margin20">{validationResult.message[0]}</p>
                } 
            </div>
            
            { buttonIsLoading 
                ? <button onClick={ event => sendForm(event)} className="button margin20 button-focus" disabled>...Wait</button>
                : <button onClick={ event => sendForm(event)} className="button margin20">Change E-Mail</button>
            }
        </div>
    )
}

export default ChangeEmail