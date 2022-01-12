import React, { useState, useEffect } from 'react' 
import Axios from 'axios' 
import ArtistForm from '../../components/Artist/ArtistForm'
import { useParams } from 'react-router-dom'
import Error422 from '../Error/Error422'

function ArtistUpdate() {
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams() 
    const [data, setData] = useState({})
    const [isError, setIsError] = useState(null)

    useEffect (() => {        
        Axios
        .get((`http://localhost:8000/artists/${id}`))
        .then((res) => {
            setData(res.data)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div>
            { (isLoading === false && isError === null) &&
                <div>
                    <h2 className="title">Update Artist</h2>

                    <ArtistForm data={data} actionType="update" id={id}/>
                </div>
            }

            { (isLoading === false && isError === 422) &&
                <Error422/>
            }
        </div>
    )
} 
  
export default ArtistUpdate 