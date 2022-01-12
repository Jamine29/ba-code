<script>
    import Axios from 'axios'
    import GroupList from '../../components/Group/GroupList.svelte'
    import ArtistList from '../../components/Artist/ArtistList.svelte'
    import Error422 from '../Error/Error422.svelte'
    import { onMount } from 'svelte'
    import { limit as limit_value} from '../../store/store'

    let limit;

    limit_value.subscribe(value => {
		limit = value;
	});

    let showArtists = true

    let showGroups = false
    let isLoading = true
    let artists = {}
    let groups = {}
    let isError = null
    let update = false
    let setUpdate = null

    onMount(async () => {        
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard?page=1&limit=${limit}`, headers)
        .then((res) => {
            artists = res.data.artists
            groups = res.data.groups
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    })

    function showGroupsButton() {
        showArtists = false
        showGroups = true
    }

    function showArtistsButton() {
        showArtists = true
        showGroups = false
    }

    function handleMoreButtonArtists() {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard/artists?page=${artists.nextPage}&limit=${limit}`, headers)
        .then((res) => {
            let artistsList = artists.docs 
            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            artists = newObject
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    }

    function handleMoreButtonGroups() {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard/groups?page=${groups.nextPage}&limit=${limit}`, headers)
        .then((res) => {
            let groupsList = groups.docs 
            let newObject = {
                ...res.data,
                docs: groupsList.concat(res.data.docs)
            }
            groups = newObject
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    }
</script>

{#if isLoading === false && isError === null}
    <div>
        <h1 class="title">Dashboard</h1>

        <div class="flex-container-row">
            <div class="dashbboard-container">
                {#if showArtists }
                    <button on:click={() => showArtistsButton()} class="button button-focus">Artists</button> 
                {:else}
                    <button on:click={() => showArtistsButton()} class="button">Artists</button> 
                {/if}
            </div>

            <div class="dashbboard-container">
                {#if showGroups } 
                    <button on:click={() => showGroupsButton()} class="button button-focus">Groups</button>
                {:else}
                    <button on:click={() => showGroupsButton()} class="button">Groups</button>
                {/if}   
            </div>
        </div>

        {#if showArtists}
            <ArtistList artists={artists} showButtons={true} showPaginate={true} handleMoreButton={handleMoreButtonArtists} setUpdate={setUpdate} update={update}/>
        {/if}

        {#if showGroups }
            <GroupList groups={groups} showButtons={true} showPaginate={true} handleMoreButton={handleMoreButtonGroups} setUpdate={setUpdate} update={update}/>
        {/if}
    </div>
{/if}

{#if isLoading === false && isError === 422 }
    <Error422/>
{/if}