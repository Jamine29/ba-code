import React, { useState, useEffect } from 'react' 
import Axios from 'axios' 
import FormData from 'form-data' 
import ReactQuill from 'react-quill' 
import 'react-quill/dist/quill.snow.css' 
import { Redirect } from 'react-router-dom'
import { modules, formats } from '../../helpers/Quill/snowLayout'



function ArtistForm(props) {
    const [validationResult, setValidationResult] = useState({})
    const [value, setValue] = useState('') 
    const [buttonIsLoading, setButtonIsLoading] = useState(false)
    const [isRedirect, setIsRedirect] = useState(false)
    const [redirectLink, setRedirectLink] = useState('')

    useEffect (() => { 
        if(props.data.facts !== undefined) {
            setValue(props.data.facts)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendForm = (event) => {
        event.preventDefault()
        event.stopPropagation()

        setButtonIsLoading(true)

        setValidationResult({})
        let error = {} 

        let formData = new FormData(document.querySelector('form')) 
        formData.append('facts', value) 

        // validation
        if(props.actionType === 'create') {
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

            if(props.actionType === 'create') {
                Axios
                .post('http://localhost:8000/artists', formData, axiosHeaders)
                .then((res) => {
                    setRedirectLink(`/artists/${res.data._id}`)
                    setIsRedirect(true)
                })
                .catch((err) => {
                    setValidationResult(err.response.data.err)
                    setButtonIsLoading(false)
                })
            }

            if(props.actionType === 'update') {
                Axios
                .put(`http://localhost:8000/artists/${props.id}`, formData, axiosHeaders)
                .then((res) => {
                    setRedirectLink(`/artists/${props.id}`)
                    setIsRedirect(true)
                    setValidationResult({})
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

        reader.addEventListener('load', function () {
            // convert image file to base64 string
            preview.src = reader.result 
        }, false) 

        if(file) {
            reader.readAsDataURL(file) 
        }
    }

    const deleteImg = (event) => {
        event.preventDefault()
        event.stopPropagation()

        document.getElementById('imagePreview').src = `https://via.placeholder.com/300?${new Date().getTime()}` 
        document.getElementById('file').value = '' 
    }

    return (
        <div>
            <div className="flex-container-column">
                <form className="form-width">
                    <div className="form-container-input-file">
                        <div className="form-img">
                            { props.data.profileImageLink === undefined 
                                ? <img className="form-img" id="imagePreview" src="https://via.placeholder.com/300?1621334899873" alt="Placeholder"/>
                                : <img className="form-img" id="imagePreview" src={props.data.profileImageLink} alt="Preview"/>
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
                            <input className="form-control" type="text" name="birthName" id="birthName" placeholder="Birth Name" defaultValue={props.data.birthName}/>
                            <label className="form-label" htmlFor="birthName">Birth Name</label>
                        </div>
                        
                        <div className="form-group">
                            <input className="form-control" type="text" name="stageName" id="stageName" placeholder="Stage Name" defaultValue={props.data.stageName}/>
                            <label className="form-label" htmlFor="stageName">Stage Name</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="birthday" id="birthday" placeholder="Birthday" defaultValue={props.data.birthday}/>
                            <label className="form-label" htmlFor="birthday">Birthday</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="zodiacSign" id="zodiacSign" placeholder="Zodiac Sign" defaultValue={props.data.zodiacSign}/>
                            <label className="form-label" htmlFor="zodiacSign">Zodiac Sign</label>
                        </div>
                        
                        <div className="form-group">
                            <input className="form-control" type="text" name="nationality" id="nationality" placeholder="Nationality" defaultValue={props.data.nationality}/>
                            <label className="form-label" htmlFor="nationality">Nationality</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="height" id="height" placeholder="Height" defaultValue={props.data.height}/>
                            <label className="form-label" htmlFor="height">Height</label>
                        </div>  

                        <div className="form-group">
                            <input className="form-control" type="text" name="weight" id="weight" placeholder="Weight" defaultValue={props.data.weight}/>
                            <label className="form-label" htmlFor="weight">Weight</label>
                        </div>

                        <div className="form-group">  
                            <input className="form-control" type="text" name="bloodType" id="bloodType" placeholder="Blood Type" defaultValue={props.data.bloodType}/>
                            <label className="form-label" htmlFor="bloodType">Blood Type</label>
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" name="positions" id="positions" placeholder="Positions" defaultValue={props.data.positions}/>
                            <label className="form-label" htmlFor="positions">Positions</label>
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
                            <ReactQuill 
                                id='editor'
                                theme="snow" 
                                value={value} 
                                onChange={handleOnChangeQuill}
                                modules={modules}
                                formats={formats} 
                                className="form-quill"
                                placeholder="Facts"
                            >
                            </ReactQuill>
                            <label className="form-display-none" htmlFor="facts">Facts:</label>
                        </div> 
                    </div>
                </form>

                <div className="form-error-message-container">
                    {validationResult.file !== undefined && <p className="form-error-message margin20">{validationResult.file[0]}</p>}
                    {validationResult.birthName !== undefined && <p className="form-error-message margin20">{validationResult.birthName[0]}</p>}
                    {validationResult.stageName !== undefined && <p className="form-error-message margin20">{validationResult.stageName[0]}</p>}
                    {validationResult.birthday !== undefined && <p className="form-error-message margin20">{validationResult.birthday[0]}</p>}
                    {validationResult.video !== undefined && <p className="form-error-message margin20">{validationResult.video[0]}</p>}
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
  
export default ArtistForm 