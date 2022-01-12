<script>
    import Axios from 'axios'
    import ArtistForm from "../../components/Artist/ArtistForm.svelte"
    import Error422 from '../Error/Error422.svelte'
    import { onMount } from 'svelte'

    export let id

    let data = {}
    let actionType = "update"
    let isLoading = true
    let isError = null

    onMount(async () => {
        Axios
        .get((`http://localhost:8000/artists/${id}`))
        .then((res) => {
            data = res.data
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    })
</script>

{#if isLoading === false && isError === null }
    <h2 class="title">Update Artist</h2>
    <ArtistForm data={data} actionType={actionType} id={id}/>
{/if}

{#if isLoading === false && isError === 422 }
    <Error422/>
{/if}