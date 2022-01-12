<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h1 class="title">Artists</h1>
                    
            <ArtistList :artists="artists" :showPaginate="true" :handleMoreButton="handleMoreButton"/>
        </div>

        <Error422 v-if="isLoading === false && isError === 422"/>

    </div>
</template>

<script>
    import Axios from 'axios'
    import ArtistList from '../../components/Artist/ArtistList.vue'
    import Error422 from '../Error/Error422.vue'
    import store from '../../store/store.js'

    export default {
        name: "Artists",
        components: {
            ArtistList,
            Error422
        },
        computed: {
            limit() {
                return store.state.limit
            }
        },
        data: () => {
            return {
                isLoading: true,
                artists: {},
                isError: null
            }
        },
        mounted() {
            Axios
            .get(`http://localhost:8000/artists?page=1&limit=${this.limit}`)
            .then((res) => {
                this.artists = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.response.staatus
                this.isLoading = false
            })
        },
        methods: {
            handleMoreButton: function() {
                Axios
                .get(`http://localhost:8000/artists?page=${this.artists.nextPage}&limit=${this.limit}`)
                .then((res) => {
                    let artistsList = this.artists.docs 
                    let newObject = {
                        ...res.data,
                        docs: artistsList.concat(res.data.docs)
                    }
                    this.artists = newObject
                    this.isLoading = false
                })
                .catch((err) => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            }
        }
    }
</script>