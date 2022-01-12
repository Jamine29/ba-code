<template>
    <div> 
        <div v-if="isLoading === false && isError === null" className="flex-container-column">
            <div className="flex-container-column">
                <img className="img" :src="artist.profileImageLink" alt="bild" />  

                <h1 className="title list-item-title">{{artist.stageName}}</h1>

                <div className="list-item-personal-description">
                    <div v-if="artist.stageName !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Stage Name</h3>
                        <p className="list-item-personal-description-text">{{artist.stageName}}</p>
                    </div>

                    
                    <div v-if="artist.birthName !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Birth Name</h3>
                        <p className="list-item-personal-description-text">{{artist.birthName}}</p>
                    </div>
                        
                    <div v-if="artist.birthday !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Birthday</h3>
                        <p className="list-item-personal-description-text">{{artist.birthday}}</p>
                    </div>

                    <div v-if="artist.bloodType !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Blood Type</h3>
                        <p className="list-item-personal-description-text">{{artist.bloodType}}</p>
                    </div>

                    <div v-if="artist.companies !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Companies</h3>
                        <p className="list-item-personal-description-text">{{artist.companies}}</p>
                    </div>

                    <div v-if="artist.nationality !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Nationality</h3>
                        <p className="list-item-personal-description-text">{{artist.nationality}}</p>
                    </div>
                            
                    <div v-if="artist.positions !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Positions</h3>
                        <p className="list-item-personal-description-text">{{artist.positions}}</p>
                    </div>

                    <div v-if="artist.weight !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Weight</h3>
                        <p className="list-item-personal-description-text">{{artist.weight}}</p>
                    </div>

                    <div v-if="artist.height !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Height</h3>
                        <p className="list-item-personal-description-text">{{artist.height}}</p>
                    </div>

                    <div v-if="artist.zodiacSign !== ''" className="list-item-personal-description-container">
                        <h3 className="list-item-personal-description-title">Zodiac Sign</h3>
                        <p className="list-item-personal-description-text">{{artist.zodiacSign}}</p>
                    </div>
                </div>


                <div v-if="artist.facts !== '' && artist.facts !== '<p><br></p>'" className="list-item-personal-description-addictional-container">
                    <h3 className="list-item-personal-description-title">Facts</h3>
                    <QuillEditor 
                        theme="bubble"
                        class="readQuill"
                        v-bind:content="artist.facts" 
                        content-type="html"
                        v-bind:readOnly="true"
                    />
                </div>

                     
                <div v-if="artist.videoSrc !== ''" className="list-item-personal-description-addictional-container">                      
                    <h3 className="list-item-personal-description-title">Latest Video</h3>   
                        <iframe 
                            className="video" 
                            :src="artist.videoSrc"
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer autoplay clipboard-write encrypted-media gyroscope" 
                            allowfullscreen="allowfullscreen" 
                        >
                        </iframe>  
                </div>        
            </div>
        </div>

        <Error404 v-if="isLoading === false && isError === 404"/>

        <Error422 v-if="isLoading === false && isError === 422"/>
    </div>
</template>

<script>
    import Axios from 'axios'
    import { QuillEditor } from '@vueup/vue-quill'
    import Error404 from '../Error/Error404.vue'
    import Error422 from '../Error/Error422.vue'

    export default {
        name: "Artist",
        components: {
            QuillEditor,
            Error404,
            Error422
        },
        props: ['id'],
        data: () => {
            return {
                artist: {},
                isLoading: true,
                isError: null
            }
        },
        mounted() {
            Axios
            .get(`http://localhost:8000/artists/${this.id}`)
            .then((res) => {
                this.artist = res.data
                this.isLoading = false
            })
            .catch(err => {
                this.isError = err.response.status
                this.isLoading = false
            })
        }
    }
</script>