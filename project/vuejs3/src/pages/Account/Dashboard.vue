<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h1 class="title">Dashboard</h1>

            <div class="flex-container-row">
                <div class="dashbboard-container">
                    <button v-if="showArtists" v-on:click="showArtistsButton" class="button button-focus">Artists</button> 
                    <button v-else v-on:click="showArtistsButton" class="button">Artists</button> 
                </div>

                <div class="dashbboard-container">
                    <button v-if="showGroups" v-on:click="showGroupsButton" class="button button-focus">Groups</button>
                    <button v-else v-on:click="showGroupsButton" class="button">Groups</button>
                </div>
            </div>
                <ArtistList v-show="showArtists" :artists="artists" :showButtons="true" :showPaginate="true" :handleMoreButton="handleMoreButtonArtists" />

                <GroupList v-show="showGroups" :groups="groups" :showButtons="true" :showPaginate="true" :handleMoreButton="handleMoreButtonGroups" />
            </div>

            <Error422 v-if="isLoading === false && isError === 422"/>
        </div>
</template>

<script>
    import Axios from 'axios'
    import GroupList from '../../components/Group/GroupList'
    import ArtistList from '../../components/Artist/ArtistList'
    import Error422 from '../Error/Error422'
    import store from '../../store/store.js'

    export default {
        name: 'Dashboard',
        components: {
            GroupList,
            ArtistList,
            Error422
        },
        computed: {
            limit() {
                return store.state.limit
            }
        },
        data: function() {
            return {
                showArtists: true,
                showGroups: false,
                isLoading: true,
                artists: {},
                groups: {},
                isError: null
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData: function() {
                let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}
                Axios
                .get(`http://localhost:8000/dashboard?page=1&limit=${this.limit}`, headers)
                .then((res) => {
                    this.artists = res.data.artists
                    this.groups = res.data.groups
                    this.isLoading = false
                })
                .catch((err) => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            },
            showGroupsButton: function() {
                this.showArtists = false
                this.showGroups = true
            },
            showArtistsButton: function() {
                this.showArtists = true
                this.showGroups = false
            },
            handleMoreButtonArtists: function() {
                let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

                Axios
                .get(`http://localhost:8000/dashboard/artists?page=${this.artists.nextPage}&limit=${this.limit}`, headers)
                .then((res) => {
                    let artistsList = this.artists.docs 
                    let newObject = {
                        ...res.data,
                        docs: artistsList.concat(res.data.docs)
                    }
                    this.artists = newObject
                })
                .catch((err) => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            },
            handleMoreButtonGroups: function() {
                let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

                Axios
                .get(`http://localhost:8000/dashboard/groups?page=${this.groups.nextPage}&limit=${this.limit}`, headers)
                .then((res) => {
                    let groupsList = this.groups.docs 
                    let newObject = {
                        ...res.data,
                        docs: groupsList.concat(res.data.docs)
                    }
                    this.groups = newObject
                })
                .catch((err) => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            }
        }
    }
</script>