<template>
    <div class="flex-container-column margin20">
        <form class="form-width">
            <div>
                <div class="form-group">  
                    <input class="form-control" type="password" name="currentPassword" id="currentPassword" placeholder="Current Password" autoComplete="off"/>
                    <label class="form-label" for="currentPassword">Old Password</label>
                </div>                    
            </div>
            <div>
                <div class="form-group">  
                    <input class="form-control" type="password" name="newPassword" id="newPassword" placeholder="New Password" autoComplete="off"/>
                    <label class="form-label" for="newPassword">New Password</label>
                </div>                    
            </div>
        </form>

        <div class="form-error-message-container">
            <p v-if="validationResult.currentPassword !== undefined" class="form-error-message margin20">{{validationResult.currentPassword[0]}}</p>
            <p v-if="validationResult.newPassword !== undefined" class="form-error-message margin20">{{validationResult.newPassword[0]}}</p>
            <p v-if="validationResult.message !== undefined" class="form-error-message margin20">{{validationResult.message[0]}}</p>
        </div>

        <button v-if="buttonIsLoading" v-on:click="sendForm($event)" class="button margin20 button-focus" disabled>Wait...</button> 
        <button v-else v-on:click="sendForm($event)" class="button margin20">Change Password</button> 
    </div>
</template>

<script>
    import Axios from 'axios'
    import {changePasswordConstraints} from '../../helpers/Validation/validation.js'
    const validate = require('validate.js')

    export default {
        name: 'ChangePassword',
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

                let newPassword = document.getElementById('newPassword').value
                let currentPassword = document.getElementById('currentPassword').value

                let validation = validate({
                    currentPassword,
                    newPassword
                }, changePasswordConstraints)

                if(validation !== undefined) {         
                    this.validationResult = validation
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
                        this.validationResult = {message: [res.data.message]}
                        this.buttonIsLoading = false
                    })
                    .catch((err) => {
                        if(err.response.data.err !== undefined) {
                            this.validationResult = {message: [err.response.data.err]}
                        }
                        this.buttonIsLoading = false
                    })
                }
                else{
                    this.buttonIsLoading = false
                }
            }
        }
    }
</script>