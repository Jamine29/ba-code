<template>
    <div class="flex-container-column">
        <div class="list-container">
            <div v-for="item in artists.docs" :key="item._id">
                <ArtistItem :item="item" :showButtons="showButtons"/>
            </div>
        </div>
        <div class="flex-container-row">
            <div class="flex-container-column margin20">
                <button v-if="artists.hasNextPage" class="button" v-on:click="this.handleMoreButton">Load More</button>
            </div>
        </div>
    </div>
</template>

<script>
    import ArtistItem from './ArtistItem.vue'

    export default {
        props: ['handleMoreButton', 'artists', 'showPaginate', 'showButtons'],
        components: {
            ArtistItem
        }
    }
</script>