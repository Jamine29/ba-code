import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute({component: Component, restricted, ...rest}) {
    return(
        <div>
        { (localStorage.getItem("jwtToken") === null)
            ? <Redirect to="/admin/login"/>
            : <Route {...rest} render={ props => (
                <Component/>
            )}/>
        }
        </div>
    )
}

export default PrivateRoute  