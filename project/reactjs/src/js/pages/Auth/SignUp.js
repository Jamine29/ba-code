import React, { useState } from 'react'
import Axios from 'axios'
import { signUpConstraints } from '../../helpers/Validation/validation.js'
import { Link } from 'react-router-dom' 
const validate = require('validate.js')

function SignUp() {
    const [validationResult, setValidationResult] = useState({})
    const [buttonIsLoading, setbuttonIsLoading] = useState(false)

    const sendData = (event) => {
        event.stopPropagation() 
        event.preventDefault() 

        setbuttonIsLoading(true)

        const email = document.getElementById('email').value.trim()
        const password = document.getElementById('password').value.trim()
        
        let validation = validate({
            email: email,
            password: password
        }, signUpConstraints)

        if(validation === undefined) {
            let axiosData = {
                email,
                password
            }

            let axiosHeaders = {
                headers: {
                    'content-type': 'application/json'
                }
            }
            
            Axios
            .post('http://localhost:8000/auth/sign-up', axiosData, axiosHeaders)
            .then((res) => {
                localStorage.setItem('jwtToken', res.data.token) 
                window.location = 'http://localhost:3000/dashboard'
            })
            .catch((err) => {
                if(err.response.data.err.email !== undefined) {
                    setValidationResult({email: [err.response.data.err.email]})
                    setbuttonIsLoading(false)
                }
                if(err.response.data.err.password !== undefined) {
                    setValidationResult({password: [err.response.data.err.email]})
                    setbuttonIsLoading(false)
                }
                if(err.response.data.message !== undefined) {
                    setValidationResult({message: [err.response.data.message]})
                    setbuttonIsLoading(false)
                }
            })
        }
        else {
            setValidationResult(validation)
            setbuttonIsLoading(false)
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-form-container">
                <h2 className="auth-title">Sign up</h2>

                <p className="auth-note">Note: Spaces before and after the entry are removed.</p> 

                <form className="auth-form">
                    <div className="form-group"> 
                        <input className="form-control" type="email" name="email" id="email" placeholder="E-Mail"/>
                        <label className="form-label" htmlFor="email">E-Mail</label>
                    </div>
                    <div className="form-group"> 
                        <input className="form-control" type="password" name="password" id="password" placeholder="Password" autoComplete="off"/>
                        <label className="form-label" htmlFor="password">Password</label>
                    </div>
                </form>

                <div className="form-error-message-container">
                    {validationResult.email !== undefined && <p className="form-error-message margin20">{validationResult.email[0]}</p>}
                    {validationResult.password !== undefined && <p className="form-error-message margin20">{validationResult.password[0]}</p>}
                    {validationResult.message !== undefined && <p className="form-error-message margin20">{validationResult.message[0]}</p>}
                </div>

                { buttonIsLoading 
                    ? <button className="button margin20 button-focus" disabled>...Wait</button>
                    : <button className="auth-button" onClick={(event) => sendData(event)}>Sign Up</button>
                }

                <Link className="auth-link" to="/admin/login">You have an account? Login</Link>
            </div>
        </div>
    )
 }

 export default SignUp 