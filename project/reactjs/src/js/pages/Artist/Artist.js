import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Error404 from '../Error/Eroro404'
import Error422 from '../Error/Error422'

function Artist() {
    const [artist, setArtist] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams() 
    const [isError, setIsError] = useState(null)

    useEffect (() => {
        Axios
        .get(`http://localhost:8000/artists/${id}`)
        .then((res) => {
            setArtist(res.data)
            setIsLoading(false)
        })
        .catch(err => {
            setIsError(err.response.status)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return (
        <div> 
            { (isLoading === false && isError === null) &&
                <div className="flex-container-column">
                    <img className="img" src={artist.profileImageLink} alt="bild" />  

                    <h1 className="title list-item-title">{artist.stageName}</h1>

                    <div className="list-item-personal-description">
                        { artist.stageName !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Stage Name</h3>
                                <p className="list-item-personal-description-text">{artist.stageName}</p>
                            </div>
                        }

                        { artist.birthName !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Birth Name</h3>
                                <p className="list-item-personal-description-text">{artist.birthName}</p>
                            </div>
                        
                        }

                        { artist.birthday !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Birthday</h3>
                                <p className="list-item-personal-description-text">{artist.birthday}</p>
                            </div>
                        }

                        { artist.bloodType !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Blood Type</h3>
                                <p className="list-item-personal-description-text">{artist.bloodType}</p>
                            </div>
                        }

                        { artist.companies !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Companies</h3>
                                <p className="list-item-personal-description-text">{artist.companies}</p>
                            </div>
                        }

                        { artist.nationality !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Nationality</h3>
                                <p className="list-item-personal-description-text">{artist.nationality}</p>
                            </div>
                        }   

                        { artist.positions !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Positions</h3>
                                <p className="list-item-personal-description-text">{artist.positions}</p>
                            </div>
                        }

                        { artist.weight !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Weight</h3>
                                <p className="list-item-personal-description-text">{artist.weight}</p>
                            </div>
                        }

                        { artist.height !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Height</h3>
                                <p className="list-item-personal-description-text">{artist.height}</p>
                            </div>
                        }

                        { artist.zodiacSign !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Zodiac Sign</h3>
                                <p className="list-item-personal-description-text">{artist.zodiacSign}</p>
                            </div>
                        }
                    </div>


                    { (artist.facts !== "" && artist.facts !== "<p><br></p>") &&
                        <div className="list-item-personal-description-addictional-container">
                            <h3 className="list-item-personal-description-title">Facts</h3>
                            <ReactQuill 
                                readOnly={true}
                                theme={"bubble"}
                                id='editor'
                                value={artist.facts} 
                                className="readQuill"
                            >
                            </ReactQuill>
                        </div>
                        }

                    { artist.videoSrc !== "" &&   
                        <div className="list-item-personal-description-addictional-container">                      
                            <h3 className="list-item-personal-description-title">Latest Video</h3>   
                            <iframe 
                                className="video" 
                                src={artist.videoSrc}
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer autoplay clipboard-write encrypted-media gyroscope" 
                                allowfullscreen="allowfullscreen" 
                            >
                            </iframe>  
                        </div> 
                    }         
                </div>
            }

            { (isLoading === false && isError === 404) &&
                <Error404/>
            }

            { (isLoading === false && isError === 422) &&
                <Error422/>
            }
        </div>
    )
}

export default Artist