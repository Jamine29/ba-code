import React, { useState } from 'react'
import Axios from 'axios'
import { changePasswordConstraints } from '../../helpers/Validation/validation.js'
const validate = require('validate.js')

function ChangePassword() {
    const [validationResult, setValidationResult] = useState({})
    const [buttonIsLoading, setButtonIsLoading] = useState(false)

    const sendForm = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setButtonIsLoading(true)

        let newPassword = document.getElementById('newPassword').value
        let currentPassword = document.getElementById('currentPassword').value

        let validation = validate({
            currentPassword,
            newPassword
        }, changePasswordConstraints)

        if(validation !== undefined) {         
            setValidationResult(validation)
        }

        if(validation === undefined) {
            let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}
            let formData = {
                currentPassword,
                newPassword
            }
            
            Axios
            .post('http://localhost:8000/dashboard/user/password', formData, headers)
            .then((res) => {
                document.getElementById('currentPassword').value = ''
                document.getElementById('newPassword').value = ''
                setValidationResult({message: [res.data.message]})
                setButtonIsLoading(false)
            })
            .catch((err) => {
                if(err.response.data.err !== undefined) {
                    setValidationResult({message: [err.response.data.err]})
                }
                setButtonIsLoading(false)
            })
        }
        else{
            setButtonIsLoading(false)
        }
    }

    return (
        <div className="flex-container-column margin20">
            <form className="form-width">
                <div>
                    <div className="form-group">  
                        <input className="form-control" type="password" name="currentPassword" id="currentPassword" placeholder="Current Password" autoComplete="off"/>
                        <label className="form-label" htmlFor="currentPassword">Old Password</label>
                    </div>                    
                </div>
                <div>
                    <div className="form-group">  
                        <input className="form-control" type="password" name="newPassword" id="newPassword" placeholder="New Password" autoComplete="off"/>
                        <label className="form-label" htmlFor="newPassword">New Password</label>
                    </div>                    
                </div>
            </form>

            <div className="form-error-message-container">
                { validationResult.currentPassword !== undefined && 
                    <p className="form-error-message margin20">{validationResult.currentPassword[0]}</p>
                }
                { validationResult.newPassword !== undefined && 
                    <p className="form-error-message margin20">{validationResult.newPassword[0]}</p>
                }
                { validationResult.message !== undefined && 
                    <p className="form-error-message margin20">{validationResult.message[0]}</p>
                } 
            </div>

            { buttonIsLoading
                ? <button onClick={ event => sendForm(event)} className="button margin20 button-focus" disabled>Wait...</button> 
                : <button onClick={ event => sendForm(event)} className="button margin20">Change Password</button> 
            }
        </div>
    )
}

export default ChangePassword 