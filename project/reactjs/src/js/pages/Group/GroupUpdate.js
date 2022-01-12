import React, { useState, useEffect } from 'react'  
import { useParams } from 'react-router-dom' 
import Axios from 'axios'  
import GroupForm from '../../components/Group/GroupForm'
import Error422 from '../Error/Error422'

function GroupUpdate() {
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()  
    const [data, setData] = useState({})
    const [isError, setIsError] = useState(null)

    useEffect (() => {
        Axios
        .get(`http://localhost:8000/groups/${id}`)
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
                    <h2 className="title">Update Group</h2>

                    <GroupForm data={data} actionType="update" id={id}/>
                </div>
            }

            { (isLoading === false && isError === 433) &&
                <Error422/>
            }
        </div>
    )
}  
  
export default GroupUpdate  