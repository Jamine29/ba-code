<script>
    import Axios from 'axios'
    import ChangePassword from '../../components/Account/ChangePassword.svelte'
    import ChangeEmail from '../../components/Account/ChangeEmail.svelte'
    import Error422 from '../Error/Error422.svelte'
    import { onMount } from 'svelte'
    import { useNavigate } from 'svelte-navigator'

    let data = null
    let changeEmail = false
    let changePassword = false
    let isLoading = true
    let isError = null

    const navigate = useNavigate();

    onMount(async () => {        
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

        Axios
        .get('http://localhost:8000/dashboard/user', headers)
        .then((res) => {
            data = res.data
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    })

    function deleteAccount() {
        if(window.confirm('Are you sure you want to delete?')) {
            let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

            Axios
            .delete('http://localhost:8000/dashboard/delete', headers)
            .then((res) => {
                localStorage.removeItem('jwtToken')
                navigate(`/admin/signup`)
            })
            .catch((err) => {
                isError = err.response.status
                isLoading = false
            })
        }
    }

    function handleChangeEmail() {
        if(changeEmail) {
            changeEmail = false
            changePassword = false
        }
        else {
            changeEmail = true
            changePassword = false
        }
    }

    function handleChangePassword() {
        if(changePassword) {
            changeEmail = false 
            changePassword = false
        }
        else {
            changeEmail = false
            changePassword = true
        }
    }
</script>

{#if isLoading === false && isError === null}
    <h2 class="title">Account</h2>
    {#if data !== null }
        <form class="flex-container-column">
            <div class="form-width">
                <div class="form-group">  
                    <input class="form-control" type="text" name="name" id="name" placeholder="E-Mail" value={data.email ? data.email : ""} disabled/>
                    <label class="form-label" for="name">E-Mail</label>
                </div>                    
            </div>
        </form>

        <div class="flex-container-row">
            <button class="button margin20" on:click={() => handleChangeEmail()}>Change E-Mail</button>
            <button class="button margin20" on:click={() => handleChangePassword()}>Change Password</button>
            <button class="button margin20" on:click={() => deleteAccount()}>Delete Account</button>
        </div>

        {#if changeEmail }
            <ChangeEmail/>
        {/if}

        {#if changePassword }
            <ChangePassword/>
        {/if}
    {/if}
{/if}

{#if isLoading === false && isError === 422 }
    <Error422/>
{/if}