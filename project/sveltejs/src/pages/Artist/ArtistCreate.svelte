<script>
    import ArtistForm from "../../components/Artist/ArtistForm.svelte"

    let data = {}
    let actionType = "create"
</script>

<div>
    <h2 class="title">Create Artist</h2>
    
    <ArtistForm data={data} actionType={actionType}/>
</div>