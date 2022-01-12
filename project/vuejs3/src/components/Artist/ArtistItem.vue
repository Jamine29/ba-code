<template>
    <div class="list-item-container">
        <router-link :to="{name: 'artistsId', params: {id: item._id}, props: true}">
            <div v-if="showButtons" class="list-item-button-container">
                <div class="flex-container-column width50">
                    <button 
                        class="list-item-button"
                        v-on:click="updateArtist(item._id, $event)"
                    >
                        <span class="material-icons list-item-icon">mode_edit</span>
                    </button>
                </div>
                <div class="flex-container-column width50">
                    <button 
                        class="list-item-button"
                        v-on:click="deleteArtist(item._id, $event)"
                    >
                        <span class="material-icons list-item-icon">delete</span>
                    </button>
                </div>
            </div>
                
            <div className="list-item-img-container">
                <img :src="item.profileImageLink" alt="bild" class="list-item-img"/>
            </div>

            <div class="list-item-descibtion">
                <p class="list-item-p">{{item.stageName}}</p>
            </div>
        </router-link>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'ArtistItem',
        props: ['item', 'showButtons'],
        methods: {
            updateArtist: function(id, event) {
                event.preventDefault()
                event.stopPropagation()
                
                this.$router.push({ name: 'artistsIdUpdate', params: { id: id } })
            },
            deleteArtist: function(id, event) {
                event.preventDefault()
                event.stopPropagation()

                if(window.confirm('Are you sure you want to delete?')) {
                    Axios
                    .delete(`http://localhost:8000/artists/${id}`)
                    .then((res) => {
                        if(res.status === 200) {
                            window.location.reload()
                        }
                    })
                    .catch(function() {
                        if(window.confirm('Something went wrong please try it later again?')) {
                            /**/
                        }
                    })
                }
            }
        }
    }
</script>