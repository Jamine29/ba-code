<script>
    import Axios from 'axios'
    import Error404 from '../Error/Error404.svelte'
    import Error422 from '../Error/Error422.svelte'
    import BubbleQuill from '../../helpers/Quill/BubbleQuill.svelte'
    import { onMount } from 'svelte'

    export let id

    let isLoading = true
    let isError = null
    let artist = {} 

    onMount(async () => {
        Axios
        .get(`http://localhost:8000/artists/${id}`)
        .then((res) => {
            artist = res.data
            isLoading = false
        })
        .catch((err) => {
            isError = err.rsponse.status
            isLoading = false
        })
    });
</script>

{#if isLoading === false && isError === null }
    <div class="flex-container-column">
        <img class="img" src={artist.profileImageLink} alt="bild" />  

        <h1 class="title list-item-title">{artist.stageName}</h1>

        <div class="list-item-personal-description">
            {#if artist.stageName !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Stage Name</h3>
                    <p class="list-item-personal-description-text">{artist.stageName}</p>
                </div>
            {/if}

            {#if artist.birthName !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Birth Name</h3>
                    <p class="list-item-personal-description-text">{artist.birthName}</p>
                </div>
            {/if}

            {#if artist.birthday !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Birthday</h3>
                    <p class="list-item-personal-description-text">{artist.birthday}</p>
                </div>
            {/if}

            {#if artist.bloodType !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Blood Type</h3>
                    <p class="list-item-personal-description-text">{artist.bloodType}</p>
                </div>
            {/if}

            {#if artist.companies !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Companies</h3>
                    <p class="list-item-personal-description-text">{artist.companies}</p>
                </div>
            {/if}

            {#if artist.nationality !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Nationality</h3>
                    <p class="list-item-personal-description-text">{artist.nationality}</p>
                </div>
            {/if}

            {#if artist.positions !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Positions</h3>
                    <p class="list-item-personal-description-text">{artist.positions}</p>
                </div>
            {/if}

            {#if artist.weight !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Weight</h3>
                    <p class="list-item-personal-description-text">{artist.weight}</p>
                </div>
            {/if}

            {#if artist.height !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Height</h3>
                    <p class="list-item-personal-description-text">{artist.height}</p>
                </div>
            {/if}

            {#if artist.zodiacSign !== "" }
                <div class="list-item-personal-description-container">
                    <h3 class="list-item-personal-description-title">Zodiac Sign</h3>
                    <p class="list-item-personal-description-text">{artist.zodiacSign}</p>
                </div>
            {/if}
        </div>

        {#if (artist.facts !== "" && artist.facts !== "<p><br></p>") }
            <div class="list-item-personal-description-addictional-container">
                <h3 class="list-item-personal-description-title">Facts</h3>
            <BubbleQuill content={artist.facts} />
            </div>
        {/if}

        {#if artist.videoSrc !== "" } 
            <div class="list-item-personal-description-addictional-container">                      
                <h3 class="list-item-personal-description-title">Latest Video</h3>   
                <iframe 
                    class="video" 
                    src={artist.videoSrc}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer autoplay clipboard-write encrypted-media gyroscope" 
                    allowfullscreen="allowfullscreen" 
                >
                </iframe>  
            </div> 
        {/if}
    </div>
{/if}

{#if isLoading === false && isError === 404 }
    <Error404/>
{/if}

{#if isLoading === false && isError === 422 }
    <Error422/>
{/if}