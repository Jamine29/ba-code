import React, {useState, useEffect} from 'react'  
import Axios from 'axios'
import GroupList from '../../components/Group/GroupList'
import ArtistList from '../../components/Artist/ArtistList'
import Error422 from '../Error/Error422'
import { Redirect } from 'react-router-dom' 
import { connect } from 'react-redux' 
const queryString = require('query-string')  

function Search(props) {
    const [showArtists, setShowArtists] = useState(true)  
    const [showGroups, setShowGroups] = useState(false)  
    const [artists, setArtists] = useState({})
    const [groups, setGroups] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const searchValue = queryString.parse(window.location.search).q  
    const [isError, setIsError] = useState(null)  
    const [isRedirect, setIsRedirect] = useState(false)
    const [q, setQ] = useState()
    const [query, setQuery] = useState('')

    useEffect(() => {
        let query = window.location.search.split('?')[1]
        setQuery(query)

        Axios
        .get(`http://localhost:8000/search?${query}&page=1&limit=${props.limit}`)
        .then((res) => {
            setArtists(res.data.artists)
            setGroups(res.data.groups)
            setIsLoading(false)
        })
        .catch(err => {
            setIsError(err.response.status)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q])

    const sendSearch = (event) => {
        event.preventDefault()
        event.stopPropagation()

        const keywords = document.getElementById('search').value  
        const obj = {q: keywords}
        const q = queryString.stringify(obj)
        setQ("/search?" +q)
        setIsRedirect(true)
    }

    const showGroupsButton = () => {
        setShowArtists(false)
        setShowGroups(true)
    }

    const showArtistsButton = () => {
        setShowArtists(true)
        setShowGroups(false)
    }

    const handleMoreButtonArtists = () => {
        Axios
        .get(`http://localhost:8000/search/artists?${query}&page=${artists.nextPage}&limit=${props.limit}`)
        .then((res) => {
            let artistsList = artists.docs  
            let newObject = {
                ...res.data,
                docs: artistsList.concat(res.data.docs)
            }
            setArtists(newObject)
        })
        .catch(err => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
    }

    const handleMoreButtonGroups = () => {
        Axios
        .get(`http://localhost:8000/search/groups?${query}&page=${groups.nextPage}&limit=${props.limit}`)
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

    return(
        <div>
            { (isLoading === false && isError === null) &&
                <div>
                    <h1 className="title">Search</h1>
                    
                    <form className="flex-container-row">
                        <div className="form-input-container form-input-container-search">
                            <div className="form-group form-group-search">  
                                <input className="form-control form-control-search" type="text" name="text" id="search" placeholder="Search" defaultValue={searchValue}/>
                                <label className="form-label" htmlFor="search">Search</label>
                            </div>                    
                        </div>
                        <div className="flex-conteiner-column">
                            <button onClick={ event => sendSearch(event)} className="form-button form-search-button">
                                <i className="material-icons">
                                    search
                                </i>
                            </button> 

                        </div>
                    </form>

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

                    {   showArtists &&
                        <div>
                            <ArtistList artists={artists} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButtonArtists}/>
                        </div>
                    }   

                    {   showGroups &&
                        <div>
                            <GroupList groups={groups} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButtonGroups}/>
                        </div>
                    }
                </div>
            }

            { (isLoading === false && isError === 422) && 
                <Error422/>
            }

            { isRedirect === true &&      
                <Redirect to={q}/>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        limit: state.search.limit
    };
};

export default connect(mapStateToProps)(Search)  