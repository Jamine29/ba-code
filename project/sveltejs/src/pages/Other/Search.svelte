<script>
    import Axios from 'axios'  
    import GroupList from '../../components/Group/GroupList.svelte'
    import ArtistList from '../../components/Artist/ArtistList.svelte'
    import Error422 from '../Error/Error422.svelte'
    import { onMount } from 'svelte'
    import queryString from 'query-string'
    import { limit as limit_value} from '../../store/store'
    import { useNavigate, useLocation } from "svelte-navigator"

    const navigate = useNavigate()
    const location = useLocation()

    let limit

    limit_value.subscribe(value => {
        limit = value;
    });

    let showArtists = true
    let showGroups = false
    let artists = {}
    let groups = {}
    let isLoading = true
    const searchValue = queryString.parse(window.location.search).q   
    let isError = null
    let query = ""

    onMount(async () => {
        query = window.location.search.split('?')[1]

        loadsearchResult()
    })

    function loadsearchResult() {
        Axios
        .get(`http://localhost:8000/search?${query}&page=1&limit=${limit}`)
        .then((res) => {
            artists = res.data.artists
            groups = res.data.groups
            isLoading = false
        })
        .catch(err => {
            isError = err.response.status
            isLoading = false
        })
    }

    function sendSearch(event) {
        event.preventDefault()
        event.stopPropagation()

        const keywords = document.getElementById('search').value  
        const obj = {q: keywords}
        const q = queryString.stringify(obj)

        navigate(`/search?${q}`, {
            state: { from: $location.pathname },
            replace: true,
        });

        query = q;

        loadsearchResult()
    }

    function showGroupsButton() {
        showArtists = false
        showGroups = true
    }

    function showArtistsButton() {
        showArtists = true
        showGroups = false
    }

    function handleMoreButtonArtists() {
        Axios
        .get(`http://localhost:8000/search/artists?${query}&page=${artists.nextPage}&limit=${limit}`)
        .then((res) => {
            let artistsList = artists.docs  
            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            artists = newObject
        })
        .catch(err => {
            isError = err.response.status
            isLoading = false
        })
    }

    function handleMoreButtonGroups() {
        Axios
        .get(`http://localhost:8000/search/groups?${query}&page=${groups.nextPage}&limit=${limit}`)
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
    <h1 class="title">Search</h1>
    <form class="flex-container-row">
        <div class="form-input-container form-input-container-search">
            <div class="form-group form-group-search">  
                <input class="form-control form-control-search" type="text" name="text" id="search" placeholder="Search" value={searchValue === undefined ? "" : searchValue}/>
                <label class="form-label" for="search">Search</label>
            </div>                    
        </div>
        <div class="flex-conteiner-column">
            <button on:click={ event => sendSearch(event)} class="form-button form-search-button">
                <i class="material-icons">
                    search
                </i>
            </button> 
        </div>
    </form>

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

    {#if showArtists }
        <ArtistList artists={artists} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButtonArtists} />
    {/if}   

    {#if showGroups }
        <GroupList groups={groups} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButtonGroups} />
    {/if}
</div>
{/if}

{#if isLoading === false && isError === 422 } 
    <Error422 /> 
{/if}