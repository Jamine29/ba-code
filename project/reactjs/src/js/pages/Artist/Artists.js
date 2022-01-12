import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import ArtistList from '../../components/Artist/ArtistList'
import Error422 from '../Error/Error422'
import { connect } from 'react-redux' 

function Artists(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [artists, setArtists] = useState({})
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        Axios
        .get(`http://localhost:8000/artists?page=1&limit=${props.limit}`)
        .then((res) => {
            setArtists(res.data)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleMoreButton = () => {
        Axios
        .get(`http://localhost:8000/artists?page=${artists.nextPage}&limit=${props.limit}`)
        .then((res) => {
            let artistsList = artists.docs 
            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            setArtists(newObject)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
    }

    return(
        <div>
            { (isLoading === false && isError === null) &&
                <div>
                    <h1 className="title">Artists</h1>
                    
                    <ArtistList artists={artists} showPaginate={true} handleMoreButton={handleMoreButton}/>
                </div>
            }

            { (isLoading === false && isError === 422) &&
                <Error422/>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        limit: state.search.limit
    };
};

export default connect(mapStateToProps)(Artists)