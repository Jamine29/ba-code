<script>
    import Axios from 'axios'
    import 'material-design-icons/iconfont/material-icons.css'  
    import { Link, useNavigate } from 'svelte-navigator'

	const navigate = useNavigate()

    export let showButtons
    export let item

    function deleteGroup(event, groupId) {
        event.preventDefault()
        event.stopPropagation()

        if(window.confirm('Are you sure you want to delete?')) {
            Axios
            .delete(`http://localhost:8000/groups/${groupId}`)
            .then((res) => {
                if(res.status === 200) {
                    window.location.reload(false) 
                }
            })
            .catch((err) => {
                console.log(err)
                if(window.confirm('Something went wrong please try it later again?')) {
                }
            })
        }
    }

    function updateGroup(event, groupId) {
        event.preventDefault()
        event.stopPropagation()

        navigate(`/groups/${groupId}/update`)
    }

</script>

<Link to={`/groups/${item._id}`} class="list-item-container">
    {#if showButtons }
        <div class="list-item-button-container">
            <div class="flex-container-column">
                <button
                    class="list-item-button"
                    on:click={event => updateGroup(event, item._id)}
                >
                    <span class="material-icons list-item-icon">mode_edit</span>
                </button>
            </div>
            <div class="flex-container-column">
                <button 
                    class="list-item-button"
                    on:click={event => deleteGroup(event, item._id)}
                >
                    <span class="material-icons list-item-icon">delete</span>
                </button>
            </div>
        </div>
    {/if}

    <div class="list-item-img-container">
        <img src={item.groupImageLink} alt="bild" class="list-item-img"/>
    </div>

    <div class="list-item-descibtion">
        <p class="list-item-p">{item.name}</p>
    </div>
</Link>