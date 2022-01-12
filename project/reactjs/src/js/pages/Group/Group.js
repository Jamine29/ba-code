import React, { useState, useEffect } from 'react'  
import Axios from 'axios'  
import { useParams } from 'react-router-dom' 
import ArtistList from '../../components/Artist/ArtistList.js'
import ReactQuill from 'react-quill'  
import 'react-quill/dist/quill.snow.css'  
import Error404 from '../Error/Eroro404'

function Group() {
    const [group, setGroup] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()  
    const [isError, setIsError] = useState(null)

    useEffect (() => {
        Axios
        .get(`http://localhost:8000/groups/${id}`)
        .then((res) => {
            setGroup(res.data)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])  

    return (
        <div>
            { (isLoading === false && isError === null) && 
                <div className="flex-container-column">
                     
                    <img className="img" src={group.groupImageLink} alt="bild" />  
                    
                    <h1 className="title list-item-title">{group.name}</h1>  

                    <div className="list-item-personal-description">
                        { group.debutDate !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Debut Date</h3>
                                <p className="list-item-personal-description-text">{group.debutDate}</p>
                            </div>
                        }

                        { group.companies !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Companies</h3>
                                <p className="list-item-personal-description-text">{group.companies}</p>
                            </div>
                        }

                        { group.fandomName !== "" &&
                            <div className="list-item-personal-description-container">
                                <h3 className="list-item-personal-description-title">Fandom Name</h3>
                                <p className="list-item-personal-description-text">{group.fandomName}</p>
                            </div>
                        }
                    </div>

                    { (group.facts !== "" && group.facts !== "<p><br></p>") &&
                        <div className="list-item-personal-description-addictional-container">
                            <h3 className="list-item-personal-description-title">Facts</h3>
                            <ReactQuill 
                                readOnly={true}
                                theme={"bubble"}
                                id='editor'
                                value={group.facts} 
                                className="readQuill"
                            >
                            </ReactQuill>
                        </div>
                    }

                    { group.artists.docs.length !== 0 &&
                        <div className="list-item-personal-description-addictional-container">
                            <h3 className="list-item-personal-description-title">Active Artists</h3>
                            { group.artists !== undefined && <ArtistList artists={group.artists} showPaginate={false} /> }
                        </div>
                    }

                    { group.formerArtists.docs.length !== 0 && 
                        <div className="list-item-personal-description-addictional-container">    
                            <h3 className="list-item-personal-description-title">Former Artists</h3>
                            { group.formerArtists !== undefined && <ArtistList artists={group.formerArtists} showPaginate={false} /> }
                        </div>
                    }
                    
                    { group.videoSrc !== "" &&
                        <div className="list-item-personal-description-addictional-container">
                            <h3 className="list-item-personal-description-title">Latest Video</h3> 
                            <iframe 
                                className="video" 
                                src={group.videoSrc}
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
        </div>
    )
}

export default Group  