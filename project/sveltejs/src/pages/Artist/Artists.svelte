<script>
    import { onMount } from 'svelte'
    import Axios from 'axios'
    import Error422 from "../Error/Error422.svelte"
    import ArtistList from "../../components/Artist/ArtistList.svelte"
    import { limit as limit_value} from '../../store/store'

    let limit; 
    
    limit_value.subscribe(value => {
		limit = value;
	});

    let isLoading = true
    let isError = null
    let artists = {}

    onMount(async () => {
        getData()
    })

    function getData() {
        let page = 1

        if(Object.keys(artists).length !== 0) {
            page = artists.nextPage
        }

        Axios
        .get(`http://localhost:8000/artists?page=${page}&limit=${limit}`)
        .then((res) => {
            let artistsList = []

            if(artists.docs !== undefined) {
                artistsList = artists.docs
            }  

            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            artists = newObject
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    }
    
    function handleMoreButton() {
        getData()
    }
</script>

{#if isLoading === false && isError === null }
    <h1 class="title">Artists</h1>   

    <ArtistList artists={artists} showPaginate={true} handleMoreButton={handleMoreButton}/>
{/if}

{#if isLoading === false && isError === 422 }
    <Error422/>
{/if}