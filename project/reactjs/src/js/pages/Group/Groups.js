import React, { useState, useEffect } from 'react'
import Axios from 'axios'  
import GroupList from '../../components/Group/GroupList'
import Error422 from '../Error/Error422'
import { connect } from 'react-redux' 

function Groups(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState({})
    const [isError, setIsError] = useState(null)

    useEffect (() => {
        Axios
        .get(`http://localhost:8000/groups?page=1&limit=${props.limit}`)
        .then((res) => {
            setGroups(res.data)
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
        .get(`http://localhost:8000/groups?page=${groups.nextPage}&limit=${props.limit}`)
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
                    <h1 className="title">Groups</h1>

                    <GroupList groups={groups} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButton}/>
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

export default connect(mapStateToProps)(Groups)