import React, { useState } from 'react'
import Axios from 'axios'
import 'material-design-icons/iconfont/material-icons.css' 
import { Link, Redirect } from 'react-router-dom'   

function ArtistItem(props) {
    const [isRedirect, setIsRedirect] = useState(false)
    const [redirectLink, setRedirectLink] = useState('')
    
    const deleteArtist = (event, artistId) => {
        event.preventDefault()
        event.stopPropagation()

        if(window.confirm('Are you sure you want to delete?')) {
            Axios
            .delete(`http://localhost:8000/artists/${artistId}`)
            .then((res) => {
                if(res.status === 200) {
                    window.location.reload() 
                }
            })
            .catch((err) => {
                if(window.confirm('Something went wrong please try it later again?')) {
                }
            })
        }
    }

    const updateArtist = (event, artistId) => {
        event.preventDefault()
        event.stopPropagation()

        setRedirectLink(`/artists/${artistId}/update`)
        setIsRedirect(true)
    }

    return (
        <Link to={`/artists/${props.item._id}`} className="list-item-container">
            { props.showButtons && 
                <div className="list-item-button-container">
                    <div className="flex-container-column">
                        <button 
                            className="list-item-button"
                            onClick={event => updateArtist(event, props.item._id)}
                        >
                            <span className="material-icons list-item-icon">mode_edit</span>
                        </button>
                    </div>
                    <div className="flex-container-column">
                        <button 
                            className="list-item-button"
                            onClick={event => deleteArtist(event, props.item._id)}
                        >
                            <span className="material-icons list-item-icon">delete</span>
                        </button>
                    </div>
                </div>
            }

            <div className="list-item-img-container">
                <img src={props.item.profileImageLink} alt="bild" className="list-item-img"/>
            </div>

            <div className="list-item-descibtion">
                <p className="list-item-p">{props.item.stageName}</p>
            </div>

            { isRedirect === true &&      
                <Redirect to={redirectLink}/>
            }
        </Link>
    ) 
}

export default ArtistItem