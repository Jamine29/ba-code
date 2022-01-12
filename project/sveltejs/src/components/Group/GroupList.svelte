<script>
    import GroupItem from './GroupItem.svelte'

    export let groups
    export let showButtons
    export let showPaginate
    export let handleMoreButton
    export let setUpdate
    export let update
</script>

<div class="flex-container-column">
    <div class="list-container">
        {#each groups.docs as item}
            <GroupItem item={item} showButtons={showButtons} />
        {/each}
    </div>

    <div>
        {#if showPaginate}
            <div class="flex-container-row">
                <div class="flex-container-column margin20">
                    {#if groups.hasNextPage } 
                        <button class="button" on:click={() => handleMoreButton()}>Load More</button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>