<template>
    <div>
        <h2 class="title">Create Artist</h2>
            
        <ArtistForm :data="data" :actionType="actionType"/>
    </div>
</template>

<script>
    import ArtistForm from '../../components/Artist/ArtistForm.vue'

    export default {
        name: 'ArtistCreate',
        components: {
            ArtistForm
        },
        data: function() {
            return {
                data: {},
                actionType: 'create'
            }
        }
    }
</script>