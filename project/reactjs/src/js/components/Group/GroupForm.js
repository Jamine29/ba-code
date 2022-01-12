import React, { useState, useEffect } from 'react'  
import Axios from 'axios'  
import FormData from 'form-data'  
import Select from 'react-select'  
import makeAnimated from 'react-select/animated'
import ReactQuill from 'react-quill'  
import 'react-quill/dist/quill.snow.css'  
import { Redirect } from 'react-router-dom'  
import { modules, formats } from '../../helpers/Quill/snowLayout'

function GroupForm(props) {
    const [validationResult, setValidationResult] = useState({})
    const [value, setValue] = useState('')  
    const [artists, setArtists] = useState(props.data.artistsV)
    const [formerArtists, setFormerArtists] = useState(props.data.formerArtistsV)
    const [availableArtists, setAvailableArtists] = useState([])  
    const [buttonIsLoading, setButtonIsLoading] = useState(false)
    const [isRedirect, setIsRedirect] = useState(false)
    const [redirectLink, setRedirectLink] = useState('')

    useEffect (() => { 
        if(artists === undefined) {
            setArtists([])
        }

        if(formerArtists === undefined) {
            setFormerArtists([])
        }

        if(props.data.facts !== undefined) {
            setValue(props.data.facts)
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
                setAvailableArtists(arr)
            }
            else {
                setAvailableArtists([])
            }
        })
        .catch((err)=>{
            setAvailableArtists([])
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChangeArtists = newValue => setArtists(newValue);

    const onChangeFormerArtists = newValue => setFormerArtists(newValue);

    const sendForm = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setButtonIsLoading(true)

        setValidationResult({})
        let error = {}  

        let formData = new FormData(document.querySelector('form'))  
        formData.append('facts', value)  
        formData.append('artists', JSON.stringify(artists))
        formData.append('formerArtists', JSON.stringify(formerArtists))

        // validation
        if(props.actionType === 'create') {
            if(formData.get('file').size === 0) {
                error.file = ['File shouuld not be empty.']
            }
        }
           
        if(formData.get('name').trim() === "") {
            error.name = ['Name shouuld not be empty.']
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
        else if(formData.get('videoLink') === '' ) {
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

            if(props.actionType === 'create') {
                Axios
                .post('http://localhost:8000/groups', formData, axiosHeaders)
                .then((res) => {
                    setRedirectLink(`/groups/${res.data._id}`)
                    setIsRedirect(true)
                })
                .catch((err) => {
                    setValidationResult(err.response.data.err)
                    setButtonIsLoading(false)
                })
            }

            if(props.actionType === 'update') {
                Axios
                .put(`http://localhost:8000/groups/${props.id}`, formData, axiosHeaders)
                .then((res) => {
                    setRedirectLink(`/groups/${props.id}`)
                    setIsRedirect(true) 
                })
                .catch((err) => {
                    setValidationResult(err.response.data.err)
                    setButtonIsLoading(false)
                })
            }
        }
        else {
            setValidationResult(error)
            setButtonIsLoading(false)
        }
    }   

    const handleOnChangeQuill = (content, delta, source, editor) => {
        setValue(editor.getHTML())  
    }

    const handleOnChangeFile = (event) => {
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

    function customTheme(theme) {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: 'hsla(240, 10%, 50%, 1)',
                primary: 'hsla(0, 16%, 82%, 1)'
            }
        }
    }  

    const deleteImg = (event) => {
        event.preventDefault()
        event.stopPropagation()

        document.getElementById('imagePreview').src = "https://via.placeholder.com/300?" + new Date().getTime()  
        document.getElementById('file').value = ""  
    }

    return (
        <div>
            <div className="flex-container-column">
                <form className="form-width">
                    <div className="form-container-input-file">
                        <div className="form-img">
                            { props.data.groupImageLink === undefined 
                                ? <img className="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                                : <img className="form-img" id="imagePreview" src={props.data.groupImageLink} alt="Preview"/>
                            }
                        </div>

                        <div className="flex-container-row">
                            <div className="margin20">
                                <label htmlFor="file">Choose Picture</label>
                                <input 
                                    className="form-file" 
                                    type="file" 
                                    name="file" 
                                    id="file"
                                    accept=".png, .jpg, .jpeg" 
                                    onChange={ event => handleOnChangeFile(event)} 
                                    autoFocus
                                />
                            </div>

                            <div className="flex-container-column margin20">
                                <button onClick={ event => deleteImg(event)} className="form-button-icon">
                                    <i className="material-icons">delete</i>
                                </button> 
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="form-group">  
                            <input className="form-control" type="text" name="name" id="name" placeholder="Group Name" defaultValue={props.data.name}/>
                            <label className="form-label" htmlFor="name">Group Name</label>
                        </div>
                        
                        <div className="form-group">
                            <input className="form-control" type="text" name="debutDate" id="debutDate" placeholder="Debut Date" defaultValue={props.data.debutDate}/>
                            <label className="form-label" htmlFor="debutDate">Debut Date</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="companies" id="companies" placeholder="Companies" defaultValue={props.data.companies}/>
                            <label className="form-label" htmlFor="companies">Companies</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="videoLink" id="videoLink" placeholder="Youtube Link" defaultValue={props.data.videoLink}/>
                            <label className="form-label" htmlFor="videoLink">Youtube Link</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="yearsActive" id="yearsActive" placeholder="Years Active" defaultValue={props.data.yearsActive}/>
                            <label className="form-label" htmlFor="yearsActive">Years Active</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="fandomName" id="fandomName" placeholder="Fandom Name" defaultValue={props.data.fandomName}/>
                            <label className="form-label" htmlFor="fandomName">Fandom Name</label>
                        </div>
                      
                        <div className="form-group">  
                            <ReactQuill 
                                id='editor'
                                theme="snow" 
                                value={value} 
                                onChange={handleOnChangeQuill}
                                modules={modules}
                                formats={formats} 
                                className="form-quill"
                                placeholder="Facts"
                                defaultValue={props.data.facts}
                            >
                            </ReactQuill>
                            <label className="form-display-none" htmlFor="facts">Facts:</label>
                        </div>

                        <div className="form-group">
                            <Select
                                component={makeAnimated()}
                                theme={customTheme}
                                options={availableArtists}
                                placeholder="Select Artists"
                                className="form-select"
                                onChange={onChangeArtists}
                                isMulti
                                isSearchable
                                noOptionsMessage={() => "No Artists"}
                                value={artists}
                            />
                            <label className="form-display-none" htmlFor="fandomName">Fandom Name</label>

                            <Select
                                component={makeAnimated()}
                                theme={customTheme}
                                options={availableArtists}
                                placeholder="Select Former Artist"
                                className="form-select"
                                onChange={onChangeFormerArtists}
                                isMulti
                                isSearchable
                                noOptionsMessage={() => "No Fromer Artists"}
                                value={formerArtists}
                            />
                            <label className="form-display-none" htmlFor="artist">Former Artists:</label>
                        </div>
                    </div>
                </form>

                <div className="form-error-message-container">
                    {validationResult.file !== undefined && <p className="form-error-message margin20">{validationResult.file[0]}</p>}
                    {validationResult.name !== undefined && <p className="form-error-message margin20">{validationResult.name[0]}</p>}
                    {validationResult.video !== undefined && <p className="form-error-message margin20">{validationResult.video[0]}</p>}
                    {validationResult.message !== undefined && <p className="form-error-message margin20">{validationResult.message[0]}</p>}
                </div>

                { buttonIsLoading
                    ? <button onClick={ event => sendForm(event)} className="form-button button-focus" disabled>Wait...</button> 
                    : <button onClick={ event => sendForm(event)} className="form-button">Send</button> 
                }

                { isRedirect === true &&      
                    <Redirect to={redirectLink}/>
                }
            </div>
        </div>
    )
}  
  
export default GroupForm  