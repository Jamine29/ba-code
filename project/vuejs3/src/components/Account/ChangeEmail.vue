<template>
    <div class="flex-container-column margin20">
        <form class="form-width">
            <div>
                <div class="form-group">  
                    <input class="form-control" type="text" name="email" id="email" placeholder="New E-Mail"/>
                    <label class="form-label" for="name">New E-Mail</label>
                </div>                    
            </div>
        </form>

        <div class="form-error-message-container">
            <p v-if="validationResult.email !== undefined" class="form-error-message margin20">{{validationResult.email[0]}}</p>
            <p v-if="validationResult.message !== undefined" class="form-error-message margin20">{{validationResult.message[0]}}</p>
        </div>
            
        <button v-if="buttonIsLoading" v-on:click="sendForm($event)" class="button margin20 button-focus" disabled>...Wait</button>
        <button v-else v-on:click="sendForm($event)" class="button margin20">Change E-Mail</button>

    </div>
</template>

<script>
    import Axios from 'axios'
    import { changeEmailConstraints } from '../../helpers/Validation/validation.js'
    const validate = require('validate.js')

    export default {
        name: 'ChangeEmail',    
        data: function() {
            return {
                validationResult: {},
                buttonIsLoading: false
            }
        },
        methods: {
            sendForm: function(event) {
                event.preventDefault()
                event.stopPropagation()

                this.buttonIsLoading = true

                let email = document.getElementById('email').value

                let validation = validate({
                    email: email
                }, changeEmailConstraints)

                if(validation !== undefined) {         
                    this.validationResult = validation
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
                            this.validationResult = {message: [res.data.message]}
                            document.getElementById('name').value = email
                            document.getElementById('email').value = ''
                            this.buttonIsLoading = false
                        }
                    })
                    .catch((err) => {
                        if(err.response.data.err !== undefined) {
                            this.validationResult = {message: [err.response.data.err]}
                        }
                        this.buttonIsLoading = false
                    })
                }
                else {
                    this.buttonIsLoading = false
                }
            }
        }
    }
</script>