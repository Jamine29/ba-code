<script>
    import Axios from 'axios'
    import FormData from 'form-data' 
    import SnowQuill from '../../helpers/Quill/SnowQuill.svelte'
    import { useNavigate } from "svelte-navigator";

	const navigate = useNavigate();

    export let id
    export let data
    export let actionType

    let validationResult = {}
    let buttonIsLoading = false

    function sendForm(event) {
        event.preventDefault()
        event.stopPropagation()

        buttonIsLoading = true

        validationResult = {}
        let error = {} 

        let formData = new FormData(document.querySelector('form')) 
        formData.append('facts', document.getElementsByClassName("ql-editor")[0].innerHTML) 

        // validation
        if(actionType === 'create') {
            if(formData.get('file').size === 0) {
                error.file = ['File should not be Empty.']
            }
        }  
        
        if(formData.get('birthName').trim() === '') {
            error.birthName = ['Birthname should not be Empty.']
        }

        if(formData.get('stageName').trim() === '') {
            error.stageName = ['Stagename should not be Empty.']
        }

        if(formData.get('birthday').trim() === '') {
            error.birthday = ['Birthday should not be Empty.']
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

            if(actionType === 'create') {
                Axios
                .post('http://localhost:8000/artists', formData, axiosHeaders)
                .then((res) => {
                    navigate(`/artists/${res.data._id}`)
                })
                .catch((err) => {
                    validationResult = err.response.data.err
                    buttonIsLoading = false
                })
            }

            if(actionType === 'update') {
                Axios
                .put(`http://localhost:8000/artists/${id}`, formData, axiosHeaders)
                .then((res) => {
                    navigate(`/artists/${id}`)
                    validationResult = {}
                })
                .catch((err) => {
                    validationResult = err.response.data.err
                    buttonIsLoading = false 
                })
            }
        }
        else {
            validationResult = error
            buttonIsLoading = false
        }
    } 

    function handleOnChangeFile(event) {
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
    }

    function deleteImg(event) {
        event.preventDefault()
        event.stopPropagation()

        document.getElementById('imagePreview').src = `https://via.placeholder.com/300?${new Date().getTime()}` 
        document.getElementById('file').value = '' 
    }
</script>

<div>
    <div class="flex-container-column">
        <form class="form-width">
            <div class="form-container-input-file">
                <div class="form-img">
                    {#if data.profileImageLink === undefined }
                        <img class="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                    {:else}
                        <img class="form-img" id="imagePreview" src={data.profileImageLink} alt="Preview"/>
                    {/if}
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
                            on:change={event => handleOnChangeFile(event)} 
                            autoFocus
                        />
                    </div>

                    <div class="flex-container-column margin20">
                        <button on:click={ event => deleteImg(event)} class="form-button-icon">
                            <i class="material-icons">delete</i>
                        </button> 
                    </div>
                </div>
            </div>

            <div>
                <div class="form-group">  
                    <input class="form-control" type="text" name="birthName" id="birthName" placeholder="Birth Name" value={data.birthName ? data.birthName : ""}/>
                    <label class="form-label" for="birthName">Birth Name</label>
                </div>
                
                <div class="form-group">
                    <input class="form-control" type="text" name="stageName" id="stageName" placeholder="Stage Name" value={data.stageName ? data.stageName : ""}/>
                    <label class="form-label" for="stageName">Stage Name</label>
                </div>

                <div class="form-group">
                    <input class="form-control" type="text" name="birthday" id="birthday" placeholder="Birthday" value={data.birthday ? data.birthday : ""}/>
                    <label class="form-label" for="birthday">Birthday</label>
                </div>

                <div class="form-group">
                    <input class="form-control" type="text" name="zodiacSign" id="zodiacSign" placeholder="Zodiac Sign" value={data.zodiacSign ? data.zodiacSign : ""}/>
                    <label class="form-label" for="zodiacSign">Zodiac Sign</label>
                </div>
                
                <div class="form-group">
                    <input class="form-control" type="text" name="nationality" id="nationality" placeholder="Nationality" value={data.nationality ? data.nationality : ""}/>
                    <label class="form-label" for="nationality">Nationality</label>
                </div>

                <div class="form-group">
                    <input class="form-control" type="text" name="height" id="height" placeholder="Height" value={data.height ? data.height : ""}/>
                    <label class="form-label" for="height">Height</label>
                </div>  

                <div class="form-group">
                    <input class="form-control" type="text" name="weight" id="weight" placeholder="Weight" value={data.weight ? data.weight : ""}/>
                    <label class="form-label" for="weight">Weight</label>
                </div>

                <div class="form-group">  
                    <input class="form-control" type="text" name="bloodType" id="bloodType" placeholder="Blood Type" value={data.bloodType ? data.bloodType : ""}/>
                    <label class="form-label" for="bloodType">Blood Type</label>
                </div>

                <div class="form-group">
                    <input class="form-control" type="text" name="positions" id="positions" placeholder="Positions" value={data.positions ? data.positions : ""}/>
                    <label class="form-label" for="positions">Positions</label>
                </div>

                <div class="form-group">
                    <input class="form-control" type="text" name="companies" id="companies" placeholder="Companies" value={data.companies ? data.companies : ""}/>
                    <label class="form-label" for="companies">Companies</label>
                </div>
                
                <div class="form-group">
                    <input class="form-control" type="text" name="videoLink" id="videoLink" placeholder="Youtube Link" value={data.videoLink ? data.videoLink : ""}/>
                    <label class="form-label" for="videoLink">Youtube Link</label>
                </div>
              
                <div class="form-group">
                    <SnowQuill 
                        content={data.facts ? data.facts : ""}
                        class="form-quill"
                    />
                    <label class="form-display-none" for="facts">Facts:</label>
                </div> 
            </div>
        </form>

        <div class="form-error-message-container">
            {#if validationResult.file !== undefined }
                <p class="form-error-message margin20">{validationResult.file[0]}</p>
            {/if}
            {#if validationResult.birthName !== undefined } 
                <p class="form-error-message margin20">{validationResult.birthName[0]}</p>
            {/if}
            {#if validationResult.stageName !== undefined }
                <p class="form-error-message margin20">{validationResult.stageName[0]}</p>
            {/if}
            {#if validationResult.birthday !== undefined } 
                <p class="form-error-message margin20">{validationResult.birthday[0]}</p>
            {/if}
            {#if validationResult.video !== undefined } 
                <p class="form-error-message margin20">{validationResult.video[0]}</p>
            {/if}
        </div>

        {#if buttonIsLoading}
            <button on:click={ event => sendForm(event)} class="form-button button-focus" disabled>Wait...</button>
        {:else}
            <button on:click={ event => sendForm(event)} class="form-button">Send</button>
        {/if}
    </div>
</div>