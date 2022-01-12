<template>
    <div>
        <div v-if="isLoading === false && isError === null" class="flex-container-column">

            <img class="img" :src="group.groupImageLink" alt="bild"/>  

            <h1 class="title list-item-title">{{group.name}}</h1>

            <div className="list-item-personal-description">
                <div v-if="group.debutDate !== ''" className="list-item-personal-description-container">
                    <h3 className="list-item-personal-description-title">Debut Date</h3>
                    <p className="list-item-personal-description-text">{{group.debutDate}}</p>
                </div>

                <div v-if="group.companies !== ''" className="list-item-personal-description-container">
                    <h3 className="list-item-personal-description-title">Companies</h3>
                    <p className="list-item-personal-description-text">{{group.companies}}</p>
                </div>

                <div v-if="group.fandomName !== ''" className="list-item-personal-description-container">
                    <h3 className="list-item-personal-description-title">Fandom Name</h3>
                    <p className="list-item-personal-description-text">{{group.fandomName}}</p>
                </div>
            </div>

            <div v-if="group.facts !== '' && group.facts !== '<p><br></p>'" className="list-item-personal-description-addictional-container">
                <h3 className="list-item-personal-description-title">Facts</h3>
                <QuillEditor 
                    theme="bubble"
                    class="readQuill"
                    v-bind:content="group.facts" 
                    content-type="html"
                    v-bind:readOnly="true"
                />
            </div>

            <div v-if="group.artists.docs.length !== 0" className="list-item-personal-description-addictional-container">
                <h3 className="list-item-personal-description-title">Active Members</h3>
                <ArtistList v-if="group.artists !== undefined" :artists="group.artists" :showPaginate="false"/>
            </div>

            <div v-if="group.formerArtists.docs.length !== 0" className="list-item-personal-description-addictional-container">
                <h3 className="list-item-personal-description-title">Former Members</h3>
                <ArtistList v-if="group.formerArtists !== undefined" :artists="group.formerArtists" :showPaginate="false"/>
            </div>
                    
            <div v-if="group.videoSrc !== ''" className="list-item-personal-description-addictional-container">
                <h3 className="list-item-personal-description-title">Latest Video</h3> 
                <iframe 
                    class="video" 
                    :src="group.videoSrc"
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer autoplay clipboard-write encrypted-media gyroscope" 
                    allowfullscreen
                >
                </iframe>
            </div>
        </div>

        <div v-if="isLoading === false && isError === 404">
            <Error404/>
        </div>
        
    </div>
</template>

<script>
    import Axios from 'axios'
    import Error404 from '../Error/Error404.vue'
    import { QuillEditor } from '@vueup/vue-quill'
    import ArtistList from '../../components/Artist/ArtistList.vue'

    export default {
        name: 'Group',
        components: {
            Error404,
            QuillEditor,
            ArtistList
        },
        props: ['id'],
        data: () => {
            return {
                group: {},
                isLoading: true,
                isError: null,
                options: {
                    readOnly: true,
                }
            }
        },
        mounted() {            
            Axios
            .get(`http://localhost:8000/groups/${this.id}`)
            .then((res) => {
                this.group = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.rsponse.status
                this.isLoading = false
            })
        }
    }
</script>