<script>
    import SnowQuill from '../../helpers/Quill/SnowQuill.svelte'
    import Axios from 'axios'
    import FormData from 'form-data' 
    import { onMount } from "svelte"
    import Select from "svelte-select"

    import { useNavigate } from "svelte-navigator";

	const navigate = useNavigate();

    export let data
    export let actionType
    export let id

    let validationResult = {}
    let availableArtists = []
    let buttonIsLoading = false

    let selectedArtists = data.artistsV
    let selectedFormerArtists = data.formerArtistsV

    onMount(async () => {
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
                availableArtists = arr
            }
            else {
                availableArtists = []
            }
        })
        .catch((err)=>{
            availableArtists = []
        })
    })

    function sendForm(event) {
        event.preventDefault()
        event.stopPropagation()

        if(selectedArtists === undefined) {
            selectedArtists = []
        }

        if(selectedFormerArtists === undefined) {
            selectedFormerArtists = []
        }

        buttonIsLoading = true

        validationResult = {}
        let error = {}  

        let formData = new FormData(document.querySelector('form'))  
        formData.append('facts', document.getElementsByClassName("ql-editor")[0].innerHTML)  
        formData.append('artists', JSON.stringify(selectedArtists))
        formData.append('formerArtists', JSON.stringify(selectedFormerArtists))

        // validation
        if(actionType === 'create') {
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

            if(actionType === 'create') {
                Axios
                .post('http://localhost:8000/groups', formData, axiosHeaders)
                .then((res) => {
                    navigate(`/groups/${res.data._id}`)
                })
                .catch((err) => {
                    validationResult = err.response.data.err
                    buttonIsLoading = false
                })
            }

            if(actionType === 'update') {
                Axios
                .put(`http://localhost:8000/groups/${id}`, formData, axiosHeaders)
                .then((res) => {
                    navigate(`/groups/${id}`) 
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

        reader.addEventListener("load", function () {
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

        document.getElementById('imagePreview').src = "https://via.placeholder.com/300?" + new Date().getTime()  
        document.getElementById('file').value = ""  
    }
</script>

<div class="flex-container-column">
    <form class="form-width">
        <div class="form-container-input-file">
            <div class="form-img">
                {#if data.groupImageLink === undefined }
                    <img class="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                {:else}
                    <img class="form-img" id="imagePreview" src={data.groupImageLink} alt="Preview"/>
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
                        on:change={ event => handleOnChangeFile(event)} 
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
                <input class="form-control" type="text" name="name" id="name" placeholder="Group Name" value={data.name ? data.name : ""}/>
                <label class="form-label" for="name">Group Name</label>
            </div>
                
            <div class="form-group">
                <input class="form-control" type="text" name="debutDate" id="debutDate" placeholder="Debut Date" value={data.debutDate ? data.debutDate : ""}/>
                <label class="form-label" for="debutDate">Debut Date</label>
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
                <input class="form-control" type="text" name="yearsActive" id="yearsActive" placeholder="Years Active" value={data.yearsActive ? data.yearsActive : ""}/>
                <label class="form-label" for="yearsActive">Years Active</label>
            </div>

            <div class="form-group">
                <input class="form-control" type="text" name="fandomName" id="fandomName" placeholder="Fandom Name" value={data.fandomName ? data.fandomName : ""}/>
                <label class="form-label" for="fandomName">Fandom Name</label>
            </div>
              
            <div class="form-group">  
                <SnowQuill content={data.facts ? data.facts : ""}/>
                <label class="form-display-none" for="facts">Facts:</label>
            </div>

            <div class="form-group"> 
                <Select items={availableArtists} isMulti={true} placeholder="Active Artists" bind:selectedValue={selectedArtists}/>
            </div>

            <div class="form-group"> 
                <Select items={availableArtists} isMulti={true} placeholder="Former Artists" bind:selectedValue={selectedFormerArtists}/>
            </div>
            
        </div>
    </form>

    <div class="form-error-message-container">
        {#if validationResult.file !== undefined}
            <p class="form-error-message margin20">{validationResult.file[0]}</p>
        {/if}
        {#if validationResult.name !== undefined}
            <p class="form-error-message margin20">{validationResult.name[0]}</p>
        {/if}
        {#if validationResult.video !== undefined} 
            <p class="form-error-message margin20">{validationResult.video[0]}</p>
        {/if}
        {#if validationResult.message !== undefined} 
            <p class="form-error-message margin20">{validationResult.message[0]}</p>
        {/if}
    </div>

    {#if buttonIsLoading }
        <button on:click={ event => sendForm(event)} class="form-button button-focus" disabled>Wait...</button> 
    {:else}
        <button on:click={ event => sendForm(event)} class="form-button">Send</button> 
    {/if}
</div>