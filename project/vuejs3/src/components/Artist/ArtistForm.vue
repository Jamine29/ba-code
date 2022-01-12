<template>
    <div>
        <div class="flex-container-column">
            <form class="form-width">
                <div class="form-container-input-file">
                    <div class="form-img"> 
                        <img v-if="data.profileImageLink === undefined " class="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                        <img v-else class="form-img" id="imagePreview" :src="data.profileImageLink" alt="Preview"/>
                    </div>

                    <div class="flex-container-row">
                        <div class="margin20">
                            <label for="file">Choose Picture</label>
                            <input 
                                class="form-file"
                                type="file" 
                                name="file" 
                                id="file"
                                accept=".png, .jpg, .jpeg" 
                                v-on:change="handleOnChangeFile($event)"
                                autoFocus
                            />
                        </div>

                        <div class="flex-container-column margin20">
                            <button v-on:click="deleteImg($event)" class="form-button-icon">
                                <i class="material-icons">delete</i>
                            </button> 
                        </div>
                    </div>
                </div>

                <div>
                    <div class="form-group">  
                        <input class="form-control" type="text" name="birthName" id="birthName" placeholder="Birth Name" :defaultValue="data.birthName"/>
                        <label class="form-label" for="birthName">Birth Name</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="stageName" id="stageName" placeholder="Stage Name" :defaultValue="data.stageName"/>
                        <label class="form-label" for="stageName">Stage Name</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="birthday" id="birthday" placeholder="Birthday" :defaultValue="data.birthday"/>
                        <label class="form-label" for="birthday">Birthday</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="zodiacSign" id="zodiacSign" placeholder="Zodiac Sign" :defaultValue="data.zodiacSign"/>
                        <label class="form-label" for="zodiacSign">Zodiac Sign</label>
                    </div>
                        
                    <div class="form-group">
                        <input class="form-control" type="text" name="nationality" id="nationality" placeholder="Nationality" :defaultValue="data.nationality"/>
                        <label class="form-label" for="nationality">Nationality</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="height" id="height" placeholder="Height" :defaultValue="data.height"/>
                        <label class="form-label" for="height">Height</label>
                    </div>  

                    <div class="form-group">
                        <input class="form-control" type="text" name="weight" id="weight" placeholder="Weight" :defaultValue="data.weight"/>
                        <label class="form-label" for="weight">Weight</label>
                    </div>

                    <div class="form-group">  
                        <input class="form-control" type="text" name="bloodType" id="bloodType" placeholder="Blood Type" :defaultValue="data.bloodType"/>
                        <label class="form-label" for="bloodType">Blood Type</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="positions" id="positions" placeholder="Positions" :defaultValue="data.positions"/>
                        <label class="form-label" for="positions">Positions</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="companies" id="companies" placeholder="Companies" :defaultValue="data.companies"/>
                        <label class="form-label" for="companies">Companies</label>
                    </div>
                        
                    <div class="form-group">
                        <input class="form-control" type="text" name="videoLink" id="videoLink" placeholder="Youtube Link" :defaultValue="data.videoLink"/>
                        <label class="form-label" for="videoLink">Youtube Link</label>
                    </div>
                      
                    <div class="form-group form-quill">
                        <QuillEditor 
                            contentType="html"
                            :options="options"
                            ref="myEditor" 
                            v-model:content="myContent" 
                            content-type="html"
                            className="form-quill"
                        />
                        <label class="form-display-none" for="facts">Facts:</label>
                    </div> 
                </div>
            </form>

            <div class="form-error-message-container">
                <p v-if="validationResult.file !== undefined" class="form-error-message margin20">{{validationResult.file[0]}}</p>
                <p v-if="validationResult.birthName !== undefined" class="form-error-message margin20">{{validationResult.birthName[0]}}</p>
                <p v-if="validationResult.stageName !== undefined" class="form-error-message margin20">{{validationResult.stageName[0]}}</p>
                <p v-if="validationResult.birthday !== undefined" class="form-error-message margin20">{{validationResult.birthday[0]}}</p>
                <p v-if="validationResult.video !== undefined" class="form-error-message margin20">{{validationResult.video[0]}}</p>
            </div>

            <button v-if="buttonIsLoading" v-on:click="sendForm($event)" class="form-button button-focus" disabled>Wait...</button>
            <button v-else v-on:click="sendForm($event)" class="form-button">Send</button>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios' 
    import FormData from 'form-data'  
    import { QuillEditor } from '@vueup/vue-quill'
    import { modules, formats } from '../../helpers/Quill/snowLayout'

    export default {
        name:'ArtistForm',
        components: {
            QuillEditor
        },
        props: ['data', 'id', 'actionType'],
        data: function() {
            return {
                myContent: '',
                validationResult: {},
                buttonIsLoading: false,
                value: '',
                options: {
                    formats,
                    modules,
                    placeholder: 'Facts',
                    readOnly: false,
                    theme: 'snow'
                } 
            }
        },
        mounted() {
            if(this.data.facts !== undefined) {
                this.$refs.myEditor.setHTML(this.data.facts)
            }
        },
        methods: {
            sendForm: function(event) {
                event.preventDefault()
                event.stopPropagation()

                this.buttonIsLoading = true

                this.validationResult = {}
                let error = {} 

                let formData = new FormData(document.querySelector('form')) 
                formData.append('facts', this.$refs.myEditor.getHTML()) 

                // validation
                if(this.actionType === 'create') {
                    if(formData.get('file').size === 0) {
                        error.file = ['File should not be empty.']
                    }
                }  
                
                if(formData.get('birthName').trim() === '') {
                    error.birthName = ['Birthname should not be empty.']
                }

                if(formData.get('stageName').trim() === '') {
                    error.stageName = ['Stagename should not be empty.']
                }

                if(formData.get('birthday').trim() === '') {
                    error.birthday = ['Birthday should not be empty.']
                }

                if(formData.get('videoLink').startsWith('https://www.youtube.com/watch?v=')) {
                    try{
                        var url_string = formData.get('videoLink')
                        var url = new URL(url_string) 
                        var v = url.searchParams.get('v')
                        if(v !== '') {
                            formData.set('videoSrc', `https://www.youtube.com/embed/${v}`)
                        }
                        else {
                            error.video = ['Video Link is not valid.']
                        }
                    }
                    catch {
                        error.video = ['Video Link is not valid.']
                    }
                }
                else if(formData.get('videoLink') !== '') {
                    error.video = ['Video Link is not valid.']
                }
                else {
                    formData.set('videoSrc', '')
                }

                if(Object.keys(error).length === 0) {
                    let axiosHeaders = {
                        headers: {
                            'content-type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                        }
                    } 

                    if(this.actionType === 'create') {
                        Axios
                        .post('http://localhost:8000/artists', formData, axiosHeaders)
                        .then((res) => {
                            this.$router.push({ name: 'artistsId', params: { id: res.data._id } })
                        })
                        .catch((err) => {
                            this.validationResult = err.response.data.err
                            this.buttonIsLoading = false
                        })
                    }

                    if(this.actionType === 'update') {
                        Axios
                        .put(`http://localhost:8000/artists/${this.id}`, formData, axiosHeaders)
                        .then(() => {
                            this.$router.push({ name: 'artistsId', params: { id: this.id } })
                        })
                        .catch((err) => {
                            this.validationResult = err.response.data.err
                            this.buttonIsLoading = false
                        })
                    }
                }
                else {
                    this.validationResult = error
                    this.buttonIsLoading = false
                }
            },
            handleOnChangeFile: function() {
                const preview = document.getElementById('imagePreview') 
                const file = document.getElementById('file').files[0] 
                const reader = new FileReader() 

                reader.addEventListener('load', function () {
                    // convert image file to base64 string
                    preview.src = reader.result 
                }, false) 

                if(file) {
                    reader.readAsDataURL(file) 
                }
            },
            deleteImg: function(event) {
                event.preventDefault()
                event.stopPropagation()

                document.getElementById('imagePreview').src = `https://via.placeholder.com/300?${new Date().getTime()}` 
                document.getElementById('file').value = '' 
            }
        }
    }
</script>