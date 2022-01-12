<template>
    <div class="flex-container-column">
        <div class="list-container">
            <div v-for="item in groups.docs" :key="item._id">
                <GroupItem :item="item" :showButtons="showButtons"/>
            </div>
        </div>

        <div class="flex-container-row">
            <div class="flex-container-column margin20">
                <button v-if="groups.hasNextPage" class="button" v-on:click="handleMoreButton">Load More</button>
            </div>
        </div>
    </div>
</template>

<script>
    import GroupItem from './GroupItem.vue'

    export default {
        name: "GroupList",
        components: {
            GroupItem
        }, 
        props: ['handleMoreButton', 'groups', 'showPaginate', 'showButtons']
    }
</script>