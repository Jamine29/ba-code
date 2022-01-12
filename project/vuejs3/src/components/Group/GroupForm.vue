<template>
    <div>
        <div class="flex-container-column">
            <form class="form-width">
                <div class="form-container-input-file">
                    <div class="form-img"> 
                        <img v-if="data.groupImageLink === undefined" class="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                        <img v-else class="form-img" id="imagePreview" :src="data.groupImageLink" alt="Preview"/>
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
                        <input class="form-control" type="text" name="name" id="name" placeholder="Group Name" :defaultValue="data.name"/>
                        <label class="form-label" for="name">Group Name</label>
                    </div>
                        
                    <div class="form-group">
                        <input class="form-control" type="text" name="debutDate" id="debutDate" placeholder="Debut Date" :defaultValue="data.debutDate"/>
                        <label class="form-label" for="debutDate">Debut Date</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="companies" id="companies" placeholder="Companies" :defaultValue="data.companies"/>
                        <label class="form-label" for="companies">Companies</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="videoLink" id="videoLink" placeholder="Youtube Link" :defaultValue="data.videoLink"/>
                        <label class="form-label" for="videoLink">Youtube Link</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="yearsActive" id="yearsActive" placeholder="Years Active" :defaultValue="data.yearsActive"/>
                        <label class="form-label" for="yearsActive">Years Active</label>
                    </div>

                    <div class="form-group">
                        <input class="form-control" type="text" name="fandomName" id="fandomName" placeholder="Fandom Name" :defaultValue="data.fandomName"/>
                        <label class="form-label" for="fandomName">Fandom Name</label>
                    </div>
                      
                    <div class="form-group form-quill">
                        <QuillEditor 
                            contentType="html"
                            :options="options"
                            ref="myEditor" 
                            v-model:content="myContent" 
                            content-type="html"
                        />
                        <label class="form-display-none" for="facts">Facts:</label>
                    </div> 

                    <div class="form-group">
                        <VueMultiselect 
                            v-model="artists"
                            :options="availableArtists"
                            :multiple="true"
                            label="label"
                            track-by="label"
                            placeholder="Select Artists"
                        />
                        <label class="form-display-none" for="artists">Artists:</label>

                        <VueMultiselect 
                            v-model="formerArtists"
                            :options="availableArtists"
                            :multiple="true"
                            label="label"
                            track-by="label"
                            placeholder="Select Former Artist"
                        />
                        <label class="form-display-none" for="artists">Former Artists:</label>
                    </div>

                        
                </div>
            </form>

            <div class="form-error-message-container">
                <p v-if="validationResult.file !== undefined" class="form-error-message margin20">{{validationResult.file[0]}}</p>
                <p v-if="validationResult.name !== undefined" class="form-error-message margin20">{{validationResult.name[0]}}</p>
                <p v-if="validationResult.video !== undefined" class="form-error-message margin20">{{validationResult.video[0]}}</p>
                <p v-if="validationResult.message !== undefined" class="form-error-message margin20">{{validationResult.message[0]}}</p>
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
    import VueMultiselect from 'vue-multiselect'
    import { modules, formats } from '../../helpers/Quill/snowLayout.js'

    export default {
        name: 'GroupForm',
        components: {
            QuillEditor, 
            VueMultiselect  
        },
        props: ['data', 'actionType', 'id'],
        data: () => ({
                value: null,
                validationResult: {},
                artists: null,
                formerArtists: null,
                availableArtists: [],
                buttonIsLoading: false,
                myContent: '',
                options: {
                    formats,
                    modules,
                    placeholder: 'Facts',
                    readOnly: false,
                    theme: 'snow'
                }
        }),
        mounted() {
            if(this.data.facts !== undefined) {
                this.$refs.myEditor.setHTML(this.data.facts)
            }

            if(this.data.artists !== undefined) {
                this.value = this.data.artists
            }
            else{
                this.artists = null
            }

            Axios
            .get('http://localhost:8000/artists')
            .then((res)=> { 
                if(res.data.error === undefined) {
                    let arr = res.data.docs.map((item) => {
                        return {
                            value: item._id,
                            label: `${item.stageName} (${item.birthday} ${item.birthName})`  
                        }
                    })
                    this.availableArtists = arr
                }
                else {
                    this.availableArtists = []
                }
            })
            .catch(() => {
                this.availableArtists = []
            })
        },
        methods: {
            sendForm: function(event) {
                event.preventDefault()
                event.stopPropagation()

                this.buttonIsLoading = true

                this.validationResult = {}
                let error = {}  

                if(this.artists === undefined) {
                    this.artists = []
                }

                if(this.formerArtists === undefined) {
                    this.formerArtists = []
                }

                let formData = new FormData(document.querySelector('form'))  
                formData.append('facts', this.$refs.myEditor.getHTML())  
                formData.append('artists', JSON.stringify(this.artists))
                formData.append('formerArtists', JSON.stringify(this.formerArtists))

                
                // validation
                if(this.actionType === 'create') {
                    if(formData.get('file').size === 0) {
                        error.file = ['File should not be empty.']
                    }
                }
                
                if(formData.get('name').trim() === "") {
                    error.name = ['Name should not be empty.']
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
                    formData.set('videoSrc','')
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
                        .post('http://localhost:8000/groups', formData, axiosHeaders)
                        .then((res) => {
                            this.$router.push({ name: 'groupsId', params: { id: res.data._id } })
                        })
                        .catch((err) => {
                            this.validationResult = err.response.data.err
                            this.buttonIsLoading = false
                        })
                    }

                    if(this.actionType === 'update') {
                        Axios
                        .put(`http://localhost:8000/groups/${this.id}`, formData, axiosHeaders)
                        .then((res) => {
                            this.$router.push({ name: 'groupsId', params: { id: res.data._id } })
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

                reader.addEventListener("load", function () {
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

                document.getElementById('imagePreview').src = "https://via.placeholder.com/300?" + new Date().getTime()  
                document.getElementById('file').value = "" 
            }
        }
    }
</script>

<style>
    @import '../../../node_modules/vue-multiselect/dist/vue-multiselect.css';

    .multiselect {
        margin-bottom: 20px;
    }
</style>