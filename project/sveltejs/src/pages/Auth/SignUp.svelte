<script>
    import Axios from 'axios'
    import { signUpConstraints } from '../../helpers/Validation/validation.js'
    import { Link } from "svelte-navigator"                                                                        
    import validate from 'validate.js'

    let validationResult = {}
    let buttonIsLoading = false

    function sendData(event) {
        event.stopPropagation() 
        event.preventDefault() 

        buttonIsLoading = true

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
                window.location = 'http://localhost:5000/dashboard'
            })
            .catch((err) => {
                if(err.response.data.err.email !== undefined) {
                    validationResult['email'] = [err.response.data.err.email]
                    buttonIsLoading = false
                }
                if(err.response.data.err.password !== undefined) {
                    validationResult['password'] = [err.response.data.err.email]
                    setbuttonIsLoading = false
                }
                if(err.response.data.message !== undefined) {
                    setValidationResult['message'] = [err.response.data.message]
                    buttonIsLoading = false
                }
            })
        }
        else {
            validationResult = validation
            buttonIsLoading = false 
        }
    }
</script>

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
            {#if validationResult.email !== undefined} 
                <p class="form-error-message margin20">{validationResult.email[0]}</p>
            {/if}
            {#if validationResult.password !== undefined}
                <p class="form-error-message margin20">{validationResult.password[0]}</p>
            {/if}
            {#if validationResult.message !== undefined } 
                <p class="form-error-message margin20">{validationResult.message[0]}</p>
            {/if}
        </div>

        {#if buttonIsLoading }
            <button class="button margin20 button-focus" disabled>...Wait</button>
        {:else}
            <button class="auth-button" on:click={(event) => sendData(event)}>Sign Up</button>
        {/if}

        <Link class="auth-link" to="/admin/login">You have an account? Login</Link>
    </div>
</div>