<script>
    import Axios from 'axios'
    import { loginConstraints } from '../../helpers/Validation/validation.js'
    import { Link } from "svelte-navigator"                                                                        
    import validate from 'validate.js'

    let validationResult = {}
    let buttonIsLoading = false

    function sendData(event) {
        event.preventDefault() 
        event.stopPropagation() 

        buttonIsLoading = true

        const email = document.getElementById('email').value.trim()
        const password = document.getElementById('password').value.trim()

        let validation = validate({
            email: email,
            password: password
        }, loginConstraints)

        if(validation === undefined) {
            validationResult = {}

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
            .post('http://localhost:8000/auth/login', axiosData, axiosHeaders)
            .then((res) => {
                if(res.data.token !== undefined) {
                    localStorage.setItem('jwtToken', res.data.token) 
                    window.location = 'http://localhost:5000/dashboard'
                }
            })
            .catch((err) => {
                validationResult = {message: [err.response.data.err]}
                buttonIsLoading = false
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
        <h2 class="auth-title">Login</h2>
        
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
            {#if validationResult.email !== undefined } 
                <p class="form-error-message margin20">{validationResult.email[0]}</p>
            {/if}
            {#if validationResult.password !== undefined } 
                <p class="form-error-message margin20">{validationResult.password[0]}</p>
            {/if}
            {#if validationResult.message !== undefined } 
                <p class="form-error-message margin20">{validationResult.message[0]}</p>
            {/if}
        </div>

        {#if buttonIsLoading } 
            <button class="button margin20 button-focus" disabled>...Wait</button>
        {:else}
            <button class="auth-button" on:click={(event) => sendData(event)}>Login</button>
        {/if}

        <Link class="auth-link" to="/admin/signup">Don't have an account? Sign Up</Link>
    </div>
</div>