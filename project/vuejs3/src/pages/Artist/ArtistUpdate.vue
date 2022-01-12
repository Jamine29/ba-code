<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h2 class="title">Update Artist</h2>

            <ArtistForm :data="data" :actionType="actionType" :id="id"/>
        </div>

        <Error422 v-if="isLoading === false && isError === 422"/>
    </div>
</template>

<script>
    import Axios from 'axios' 
    import ArtistForm from '../../components/Artist/ArtistForm.vue'
    import Error422 from '../Error/Error422'

    export default {
        name: 'artistUpdate',
        components: {
            ArtistForm,
            Error422
        },
        props: ['id'],
        data: function() {
            return {
                isLoading: true,
                data: {},
                isError: null,
                actionType: 'update'
            }
        },
        mounted() {
            Axios
            .get((`http://localhost:8000/artists/${this.id}`))
            .then((res) => {
                this.data = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.response.status
                this.isLoading = false
            })
        }
    }
</script>