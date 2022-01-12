<script>
    import Axios from 'axios'  
    import ArtistList from '../../components/Artist/ArtistList.svelte'
    import Error404 from '../Error/Error404.svelte'
    import Quill from '../../helpers/Quill/BubbleQuill.svelte'

    import { onMount } from "svelte"

    export let id
      
    let isLoading = true
    let isError = null
    let group = {}
      
    onMount(async () => {
        Axios
        .get(`http://localhost:8000/groups/${id}`)
        .then((res) => {
            group = res.data
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            iisLoading = false
        })
    });
</script>

{#if isLoading === false && isError === null}
    <div class="flex-container-column">
        <img class="img" src={group.groupImageLink} alt="bild" />
        
        <h1 class="title list-item-title">{group.name}</h1>

        <div class="list-item-personal-description">
            {#if group.debutDate !== ""}
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Debut Date</h3>
                    <p class="list-item-personal-description-text">{group.debutDate}</p>
                </div>
            {/if}

            {#if group.companies !== ""}
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Companies</h3>
                    <p class="list-item-personal-description-text">{group.companies}</p>
                </div>
            {/if}

            {#if group.fandomName !== ""}
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Fandom Name</h3>
                    <p class="list-item-personal-description-text">{group.fandomName}</p>
                </div>
            {/if}
        </div>

        {#if (group.facts !== "" && group.facts !== "<p><br></p>") }
            <div class="list-item-personal-description-addictional-container">
                <h3 class="list-item-personal-description-title">Facts</h3>
                <Quill content={group.facts} />
            </div>
        {/if}

        {#if group.artists.docs.length !== 0}
            <div class="list-item-personal-description-addictional-container">
                <h3 class="list-item-personal-description-title">Active Artists</h3>
                {#if group.artists !== undefined}
                    <ArtistList artists={group.artists} showPaginate={false} />
                {/if}
            </div>
        {/if}

        {#if group.formerArtists.docs.length !== 0}
            <div class="list-item-personal-description-addictional-container">    
                <h3 class="list-item-personal-description-title">Former Artists</h3>
                {#if group.formerArtists !== undefined}
                   <ArtistList artists={group.formerArtists} showPaginate={false} />
                {/if}
            </div>
        {/if}
            
        {#if group.videoSrc !== ""}
            <div class="list-item-personal-description-addictional-container">
                <h3 class="list-item-personal-description-title">Latest Video</h3> 
                <iframe 
                    class="video" 
                    src={group.videoSrc}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer autoplay clipboard-write encrypted-media gyroscope" 
                    allowfullscreen
                >
                </iframe>
            </div>
        {/if}
    </div>
{/if}

{#if isLoading === false && isError === 404}
    <Error404/>
{/if}