<script>
    import Groups from "../pages/Group/Groups.svelte"
    import Group from "../pages/Group/Group.svelte"
    import Artists from "../pages/Artist/Artists.svelte"
    import Artist from "../pages/Artist/Artist.svelte"
    import SignUp from "../pages/Auth/SignUp.svelte"
    import Login from "../pages/Auth/Login.svelte"
    import Search from  "../pages/Other/Search.svelte"
    import ArtistCreate from "../pages/Artist/ArtistCreate.svelte"
    import GroupCreate from "../pages/Group/GroupCreate.svelte"
    import ArtistUpdate from "../pages/Artist/ArtistUpdate.svelte"
    import GroupUpdate from "../pages/Group/GroupUpdate.svelte"
    import Dashboard from '../pages/Account/Dashboard.svelte'
    import Account from '../pages/Account/Account.svelte'
    import Home from '../pages/Other/Home.svelte'

    import PrivateRoute from "./PrivateRoute.svelte"
    import PublicRoute from "./PublicRoute.svelte"
</script>

<PrivateRoute path="dashboard" let:location>
    <Dashboard />
</PrivateRoute>

<PrivateRoute path="dashboard/account" let:location>
    <Account />
</PrivateRoute>

<PrivateRoute path="groups/create" let:location>
    <GroupCreate />
</PrivateRoute>

<PrivateRoute path="artists/create" let:location>
    <ArtistCreate />
</PrivateRoute>

<PrivateRoute path="groups/:id/update" let:location let:params>
    <GroupUpdate id={params.id}/>
</PrivateRoute>

<PrivateRoute path="artists/:id/update" let:location let:params>
    <ArtistUpdate id={params.id}/>
</PrivateRoute>

<PublicRoute path="search" restricted={false} let:params let:location>
    <Search params={params} />
</PublicRoute>

<PublicRoute path="admin/login" restricted={true} let:params let:location>
    <Login />
</PublicRoute>

<PublicRoute path="admin/signup" restricted={true}>
    <SignUp />
</PublicRoute>

<PublicRoute path="groups" restricted={false}>
    <Groups />
</PublicRoute>

<PublicRoute path="groups/:id" let:params restricted={false}>
    <Group id={params.id}/>
</PublicRoute>

<PublicRoute path="artists" restricted={false}>
    <Artists />
</PublicRoute>

<PublicRoute exact path="artists/:id" let:params restricted={false}>
    <Artist id={params.id}/>
</PublicRoute>

<PublicRoute path="" restricted={false} let:params let:location>
    <Home />
</PublicRoute>