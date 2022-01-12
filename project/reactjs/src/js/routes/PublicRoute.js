import React from 'react'
import { Route, Redirect } from 'react-router-dom'

function PublicRoute({component: Component, restricted, ...rest}) {
    return(
        <Route {...rest} render={ props => (
            localStorage.getItem("jwtToken") !== null && restricted 
            ? <Redirect to="/dashboard"/> 
            : <Component/>
        )}/>
    )
}

export default PublicRoute  