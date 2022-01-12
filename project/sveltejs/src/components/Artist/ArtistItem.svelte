<script>
    import 'material-design-icons/iconfont/material-icons.css' 
    import Axios from 'axios'
    import { Link, useNavigate } from 'svelte-navigator'

    const navigate = useNavigate()

    export let showButtons
    export let item

    function deleteArtist(event, artistId) {
        event.preventDefault()
        event.stopPropagation()

        if(window.confirm('Are you sure you want to delete?')) {
            Axios
            .delete(`http://localhost:8000/artists/${item._id}`)
            .then((res) => {
                if(res.status === 200) {
                    window.location.reload() 
                }
            })
            .catch((err) => {
                if(window.confirm('Something went wrong please try it later again?')) {
                }
            })
        }
    }

    function updateArtist(event, artistId) {
        event.preventDefault()
        event.stopPropagation()

        navigate(`/artists/${item._id}/update`)
    }
</script>


<Link to={`/artists/${item._id}`} class="list-item-container">
    {#if showButtons}
        <div class="list-item-button-container">
            <div class="flex-container-column width50">
                <button 
                    class="list-item-button"
                    on:click={event => updateArtist(event, item._id)}
                    >
                    <span class="material-icons list-item-icon">mode_edit</span>
                </button>
            </div>
            <div class="flex-container-column width50">
                <button 
                    class="list-item-button"
                    on:click={event => deleteArtist(event, item._id)}
                >
                    <span class="material-icons list-item-icon">delete</span>
                </button>
            </div>
        </div>
    {/if}

    <div class="list-item-img-container">
        <img src={item.profileImageLink} alt="bild" class="list-item-img"/>
    </div>

    <div class="list-item-descibtion">
        <p class="list-item-p">{item.stageName}</p>
    </div>
</Link>