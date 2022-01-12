<script>
    import Axios from 'axios'
    import { changeEmailConstraints } from '../../helpers/Validation/validation.js'
    import validate from 'validate.js'

    let validationResult = {}
    let buttonIsLoading = false

    function sendForm(event) {
        event.preventDefault()
        event.stopPropagation()

        buttonIsLoading = true

        let email = document.getElementById('email').value

        let validation = validate({
            email: email
        }, changeEmailConstraints)

        if(validation !== undefined) {         
            validationResult = validation
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
                    validationResult = {message: [res.data.message]}
                    document.getElementById('name').value = email 
                    document.getElementById('email').value = ''
                }
                buttonIsLoading = false
            })
            .catch((err) => {
                if(err.response.data.err !== undefined) {
                    validationResult = {message: [err.response.data.err]}
                }
                buttonIsLoading = false
            })
        }
        else {
            buttonIsLoading = false
        }
    }
</script>

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
        {#if validationResult.email !== undefined }
            <p class="form-error-message margin20">{validationResult.email[0]}</p>
        {/if} 
        {#if validationResult.message !== undefined }
            <p class="form-error-message margin20">{validationResult.message[0]}</p>
        {/if} 
    </div>
    
    {#if buttonIsLoading }
        <button on:click={ event => sendForm(event)} class="button margin20 button-focus" disabled>...Wait</button>
    {:else}
        <button on:click={ event => sendForm(event)} class="button margin20">Change E-Mail</button>
    {/if}
</div>