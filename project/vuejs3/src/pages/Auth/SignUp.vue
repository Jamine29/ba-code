<template>
    <div class="auth-container">
        <div class="auth-form-container">
            <h2 class="auth-title">Sign up</h2>

            <p class="auth-note">Note: Spaces before and after the entry are removed.</p> 

            <form class="auth-form">
                <div class="form-group"> 
                    <input class="form-control" type="email" name="email" id="email" placeholder="E-Mail"/>
                    <label class="form-label" for="email">E-Mail</label>
                </div>
                <div class="form-group"> 
                    <input class="form-control" type="password" name="password" id="password" placeholder="Password" autoComplete="off"/>
                    <label class="form-label" for="password">Password</label>
                </div>
            </form>

            <div class="form-error-message-container">
                <p v-if="validationResult.email !== undefined" class="form-error-message margin20">{{validationResult.email[0]}}</p>
                <p v-if="validationResult.password !== undefined" class="form-error-message margin20">{{validationResult.password[0]}}</p>
                <p v-if="validationResult.message !== undefined" class="form-error-message margin20">{{validationResult.message[0]}}</p>
            </div>

            <button v-if="buttonIsLoading" class="button margin20 button-focus" disabled>...Wait</button>
            <button v-else class="auth-button" v-on:click="sendData($event)">Sign Up</button>

            <router-link :to="'login'" class="auth-link" >You have an account? Login</router-link>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios'
    import { signUpConstraints } from '../../helpers/Validation/validation.js'
    const validate = require('validate.js')

    export default {
        name: 'SignUp',
        data: function() {
            return {
                validationResult: {},
                buttonIsLoading: false
            }
        },
        methods: {
            sendData: function (event){
                event.stopPropagation() 
                event.preventDefault() 

                this.buttonIsLoading = true

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
                        window.location = 'http://localhost:8080/dashboard'
                    })
                    .catch((err) => {
                        if(err.response.data.err.email !== undefined) {
                            this.validationResult['email'] = [err.response.data.err.email]
                            this.buttonIsLoading = false
                        }
                        if(err.response.data.err.password !== undefined) {
                            this.validationResult['password'] = [err.response.data.err.email]
                            this.buttonIsLoading = false
                        }
                        if(err.response.data.message !== undefined) {
                            this.validationResult['message'] = [err.response.data.message]
                            this.buttonIsLoading = false
                        }
                    })
                }
                else {
                    this.validationResult = validation
                    this.buttonIsLoading = false
                }
            }
        }
    }
</script>