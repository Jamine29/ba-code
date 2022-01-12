import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import ChangePassword from '../../components/Account/ChangePassword'
import ChangeEmail from '../../components/Account/ChangeEmail'
import Error422 from '../Error/Error422'

function Account() {
    const [data, setData] = useState(null)
    const [changeEmail, setChangeEmail] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

        Axios
        .get('http://localhost:8000/dashboard/user', headers)
        .then((res) => {
            setData(res.data)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsError(err.response.status)
            setIsLoading(false)
        })
    }, [])

    const deleteAccount = () => {
        if(window.confirm('Are you sure you want to delete?')) {
            let headers = {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}} 

            Axios
            .delete('http://localhost:8000/dashboard/delete', headers)
            .then((res) => {
                localStorage.removeItem('jwtToken')
                window.location = 'http://localhost:3000/admin/signup'
            })
            .catch((err) => {
                setIsError(err.response.status)
                setIsLoading(false)
            })
        }
    }

    const handleChangeEmail = () => {
        if(changeEmail) {
            setChangeEmail(false)
            setChangePassword(false)
        }
        else {
            setChangeEmail(true)
            setChangePassword(false)
        }
    }

    const handleChangePassword = () => {
        if(changePassword) {
            setChangeEmail(false)
            setChangePassword(false)
        }
        else {
            setChangeEmail(false)
            setChangePassword(true)
        }
    }

    return (
        <div>
            { (isLoading === false && isError === null && data !== null) && 
                <div>
                    <h2 className="title">Account</h2>

                    { data !== null &&
                        <form className="flex-container-column">
                            <div className="form-width">
                                <div className="form-group">  
                                    <input className="form-control" type="text" name="name" id="name" placeholder="E-Mail" defaultValue={data.email} disabled/>
                                    <label className="form-label" htmlFor="name">E-Mail</label>
                                </div>                    
                            </div>
                        </form>
                    }

                    <div className="flex-container-row">
                        <button className="button margin20" onClick={() => handleChangeEmail()}>Change E-Mail</button>
                        <button className="button margin20" onClick={() => handleChangePassword()}>Change Password</button>
                        <button className="button margin20" onClick={() => deleteAccount()}>Delete Account</button>
                    </div>

                    { changeEmail && 
                        <ChangeEmail/>
                    }

                    { changePassword  && 
                        <ChangePassword/>
                    }

                </div>
            }

            { (isLoading === false && isError === 422) && 
                <Error422/>
            }
        </div>
    )
}

export default Account