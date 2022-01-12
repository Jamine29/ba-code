import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import GroupList from '../../components/Group/GroupList'
import ArtistList from '../../components/Artist/ArtistList'
import Error422 from '../Error/Error422'
import { connect } from 'react-redux' 

function Dashboard(props) {
    const [showArtists, setShowArtists] = useState(true) 
    const [showGroups, setShowGroups] = useState(false) 
    const [isLoading, setIsLoading] = useState(true)
    const [artists, setArtists] = useState({})
    const [groups, setGroups] = useState({})
    const [isError, setIsError] = useState(null)
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard?page=1&limit=${props.limit}`, headers)
        .then((res) => {
            setArtists(res.data.artists)
            setGroups(res.data.groups)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    const showGroupsButton = () => {
        setShowArtists(false)
        setShowGroups(true)
    }

    const showArtistsButton = () => {
        setShowArtists(true)
        setShowGroups(false)
    }

    const handleMoreButtonArtists = () => {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard/artists?page=${artists.nextPage}&limit=${props.limit}`, headers)
        .then((res) => {
            let artistsList = artists.docs 
            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            setArtists(newObject)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
    }

    const handleMoreButtonGroups = () => {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}}

        Axios
        .get(`http://localhost:8000/dashboard/groups?page=${groups.nextPage}&limit=${props.limit}`, headers)
        .then((res) => {
            let groupsList = groups.docs 
            let newObject = {
                ...res.data,
                docs: groupsList.concat(res.data.docs)
            }
            setGroups(newObject)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
    }

    return (
        <div>
            { (isLoading === false && isError === null) &&
                <div>
                    <h1 className="title">Dashboard</h1>

                    <div className="flex-container-row">
                        <div className="dashbboard-container">
                            { showArtists
                                ? <button onClick={() => showArtistsButton()} className="button button-focus">Artists</button> 
                                : <button onClick={() => showArtistsButton()} className="button">Artists</button> 

                            }
                        </div>

                        <div className="dashbboard-container">
                            { showGroups 
                                ? <button onClick={() => showGroupsButton()} className="button button-focus">Groups</button>
                                : <button onClick={() => showGroupsButton()} className="button">Groups</button>
                            }   
                        </div>
                    </div>

                    { showArtists && 
                        <ArtistList artists={artists} showButtons={true} showPaginate={true} handleMoreButton={handleMoreButtonArtists} setUpdate={setUpdate} update={update}/>
                    }

                    { showGroups &&
                        <GroupList groups={groups} showButtons={true} showPaginate={true} handleMoreButton={handleMoreButtonGroups} setUpdate={setUpdate} update={update}/>
                    }
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

export default connect(mapStateToProps)(Dashboard)