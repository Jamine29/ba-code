<script>
    import Axios from 'axios'
    import { changePasswordConstraints } from '../../helpers/Validation/validation'
    import validate from 'validate.js'

    let validationResult = {}
    let buttonIsLoading = false

    function sendForm(event) {
        event.preventDefault()
        event.stopPropagation()

        buttonIsLoading = true

        let newPassword = document.getElementById('newPassword').value
        let currentPassword = document.getElementById('currentPassword').value

        let validation = validate({
            currentPassword,
            newPassword
        }, changePasswordConstraints)

        if(validation !== undefined) {         
            validationResult = validation
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
                validationResult = {message: [res.data.message]}
                buttonIsLoading = false
            })
            .catch((err) => {
                if(err.response.data.err !== undefined) {
                    validationResult = {message: [err.response.data.err]}
                }
                buttonIsLoading = false
            })
        }
        else{
            buttonIsLoading = false
        }
    }
</script>

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
        {#if validationResult.currentPassword !== undefined }
            <p class="form-error-message margin20">{validationResult.currentPassword[0]}</p>
        {/if}
        {#if validationResult.newPassword !== undefined}
            <p class="form-error-message margin20">{validationResult.newPassword[0]}</p>
        {/if}
        {#if validationResult.message !== undefined }
            <p class="form-error-message margin20">{validationResult.message[0]}</p>
        {/if} 
    </div>

    {#if buttonIsLoading }
        <button on:click={ event => sendForm(event)} class="button margin20 button-focus" disabled>Wait...</button> 
    {:else}
        <button on:click={ event => sendForm(event)} class="button margin20">Change Password</button> 
    {/if}
</div>