<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h1 class="title">Search</h1>
                    
            <form class="flex-container-row">
                <div class="form-input-container form-input-container-search">
                    <div class="form-group form-group-search">  
                        <input class="form-control form-control-search" type="text" name="text" id="search" placeholder="Search" :defaultValue="searchValue"/>
                        <label class="form-label" for="search">Search</label>
                    </div>                    
                </div>
                <div class="flex-conteiner-column">
                    <button v-on:click="sendSearch($event)" class="form-button form-search-button">
                        <i class="material-icons">
                            search
                        </i>
                    </button>

                </div>
            </form>
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

            <div>
                <ArtistList v-show="showArtists" :artists="artists" :showButtons="false" :showPaginate="true" :handleMoreButton="handleMoreButtonArtists"/>
            </div>

            <div>
                <GroupList v-show="showGroups" :groups="groups" :showButtons="false" :showPaginate="true" :handleMoreButton="handleMoreButtonGroups"/>
            </div>
        </div>
            <Error422 v-if="isLoading === false && isError === 422"/>
        </div>
</template>

<script>
    import Axios from 'axios'
    import GroupList from '../../components/Group/GroupList.vue'
    import ArtistList from '../../components/Artist/ArtistList.vue'
    import Error422 from '../Error/Error422.vue'
    import store from '../../store/store.js'
    const queryString = require('query-string')  

    export default {
        name: "Search",
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
                artists: {},
                groups: {}, 
                isLoading: true,
                searchValue: queryString.parse(window.location.search).q,
                parsed: queryString.parse(window.location.search),
                isError: null,
                q: '',
                query: ''
            }
        },
        mounted() {
            this.query = window.location.search.split('?')[1];
            this.sendData()
        },
        methods: {
            sendData: function() {
                Axios
                .get(`http://localhost:8000/search?${this.query}&page=1&limit=${this.limit}`)
                .then((res) => {
                    this.artists = res.data.artists
                    this.groups = res.data.groups
                    this.isLoading = false
                })
                .catch(err => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            },
            sendSearch: function(event)  {
                event.preventDefault()
                event.stopPropagation()

                const keywords = document.getElementById('search').value  
                const obj = {q: keywords}
                const q = queryString.stringify(obj)
                this.q = "/search?" + q 
                this.query = q

                this.$router.push(`www.localhost:8080/search?${q}`);

                this.sendData()
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
                Axios
                .get(`http://localhost:8000/search/artists?${this.query}&page=${this.artists.nextPage}&limit=${this.limit}`)
                .then((res) => {
                    let artistsList = this.artists.docs  
                    let newObject = {
                        ...res.data,
                        docs: artistsList.concat(res.data.docs)
                    }
                    this.artists = newObject
                })
                .catch(err => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            },
            handleMoreButtonGroups: function() {
                Axios
                .get(`http://localhost:8000/search/groups?${this.query}&page=${this.artists.nextPage}&limit=${this.limit}`)
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