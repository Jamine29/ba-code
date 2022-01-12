<template>
    <div>
        <div v-if="isLoading === false && isError === null && data !== null">
            <h2 class="title">Account</h2>
            <form class="flex-container-column">
                <div class="form-width">
                    <div class="form-group">  
                        <input class="form-control" type="text" name="name" id="name" placeholder="E-Mail" :defaultValue="data.email" disabled/>
                        <label class="form-label" for="name">E-Mail</label>
                    </div>                    
                </div>
            </form>

            <div class="flex-container-row">
                <button class="button margin20" v-on:click="handleChangeEmail">Change E-Mail</button>
                <button class="button margin20" v-on:click="handleChangePassword">Change Password</button>
                <button class="button margin20" v-on:click="deleteAccount">Delete Account</button>
            </div>

            <ChangeEmail v-if="changeEmail"/>

            <ChangePassword v-if="changePassword"/>

        </div>

        <Error422 v-if="isLoading === false && isError === 422"/>

    </div>
</template>

<script>
    import Axios from 'axios'
    import ChangePassword from '../../components/Account/ChangePassword.vue'
    import ChangeEmail from '../../components/Account/ChangeEmail.vue'
    import Error422 from '../Error/Error422'

    export default {
        name: 'Account',
        components: {
            ChangePassword,
            ChangeEmail,
            Error422
        },
        data: function() {
            return {
                data: null,
                changeEmail: false,
                changePassword: false, 
                isLoading: true,
                isError: null
            }
        },
        mounted() {
            let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

            Axios
            .get('http://localhost:8000/dashboard/user', headers)
            .then((res) => {
                this.data = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.response.status
                this.isLoading = false
            })
        },
        methods: {
            deleteAccount: function() {
                if(window.confirm('Are you sure you want to delete?')) {
                    let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

                    Axios
                    .delete('http://localhost:8000/dashboard/delete', headers)
                    .then(() => {
                        localStorage.removeItem('jwtToken')
                        window.location = 'http://localhost:3000/admin/signup'
                    })
                    .catch((err) => {
                        this.isError = err.response.status
                        this.isLoading = false
                    })
                }
            },
            handleChangeEmail: function() {
                if(this.changeEmail) {
                    this.changeEmail = false
                    this.changePassword = false
                }
                else {
                    this.changeEmail = true
                    this.changePassword = false
                }
            },
            handleChangePassword: function() {
                if(this.changePassword) {
                    this.changeEmail = false
                    this.changePassword = false
                }
                else {
                    this.changeEmail = false
                    this.changePassword = true
                }
            }
        }
    }
</script>