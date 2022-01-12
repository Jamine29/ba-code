import React from 'react'  
import {Switch} from 'react-router-dom'  

import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

import SignUp from '../pages/Auth/SignUp'
import Login from '../pages/Auth/Login'

import Artists from '../pages/Artist/Artists'
import Groups from '../pages/Group/Groups'
import Search from '../pages/Other/Search'

import Artist from '../pages/Artist/Artist'
import ArtistCreate from '../pages/Artist/ArtistCreate'
import ArtistUpdate from '../pages/Artist/ArtistUpdate'

import Group from '../pages/Group/Group'
import GroupCreate from '../pages/Group/GroupCreate'
import GroupUpdate from '../pages/Group/GroupUpdate'

import Dashboard from '../pages/Account/Dashboard'
import Account from '../pages/Account/Account'

import Home from '../pages/Other/Home'

import Error404 from '../pages/Error/Eroro404'

import { useLocation } from "react-router-dom";
import { useEffect } from 'react'

function Routes() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    return (
        <Switch>
            <PublicRoute exact strict path="/" component={Home} restricted={false}/>
            <PublicRoute exact strict path="/admin/signup" component={SignUp} restricted={true}/>
            <PublicRoute exact strict path="/admin/login" component={Login} restricted={true}/>
            
            <PublicRoute exact strict path="/artists" component={Artists} restricted={false}/>
            <PublicRoute exact strict path="/groups" component={Groups} restricted={false}/>
            <PublicRoute exact strict path="/search" component={Search} restricted={false}/>

            <PrivateRoute exact strict path="/artists/create" component={ArtistCreate}/>
            <PublicRoute exact strict path="/artists/:id" component={Artist}/>
            <PrivateRoute exact strict path="/artists/:id/update" component={ArtistUpdate}/>

            <PrivateRoute exact strict path="/groups/create" component={GroupCreate}/>
            <PublicRoute exact strict path="/groups/:id" component={Group}/>
            <PrivateRoute exact strict path="/groups/:id/update" component={GroupUpdate}/>

            <PrivateRoute exact strict path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact strict path="/dashboard/account" component={Account}/>

            <PublicRoute component={Error404}/>
        </Switch>
    )
}

export default Routes  