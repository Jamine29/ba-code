<script>
    import ArtistItem from './ArtistItem.svelte'

    export let artists
    export let showPaginate
    export let handleMoreButton
    export let showButtons

</script>

<div class="flex-container-column">
    <div class="list-container">
        {#each artists.docs as item}
            <ArtistItem item={item} showButtons={showButtons} />
        {/each}
    </div>
    <div>
        {#if showPaginate}
            <div class="flex-container-row">
                <div class="flex-container-column margin20">
                    {#if artists.hasNextPage}
                        <button class="button" on:click={() => handleMoreButton()}>Load More</button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>