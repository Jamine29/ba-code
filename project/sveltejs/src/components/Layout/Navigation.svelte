<script>
    import { Link } from "svelte-navigator"
    import 'material-design-icons/iconfont/material-icons.css' 
    
    function logout() {
        localStorage.removeItem('jwtToken')
        window.location = 'http://localhost:5000/admin/login'
    }
</script>

<nav>
    <ul>
        <li>
            <Link to="/search">
                <i class="material-icons">
                    search
                </i>
            </Link>
        </li>
        <li>
            <Link to="/groups">
                <span>Groups</span>
            </Link>
        </li>
        <li>
            <Link to="/artists">
                <span>Artists</span>
            </Link>
        </li>
        {#if localStorage.getItem('jwtToken') !== null }
            <li>
                <Link to="/dashboard/account">
                    <i class="material-icons">
                        person
                    </i>
                </Link>
                <ul>
                    <li class="nav-item">
                        <Link to="/dashboard">
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/dashboard/account">
                            <span>My Account</span>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/artists/create">
                            <span>Create Artist</span>
                        </Link>
                    </li>  
                    <li class="nav-item">
                        <Link to="/groups/create">
                            <span>Create Group</span>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <button class="nav-button" on:click={() => {logout()}}>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </li>
        {/if}
    </ul>
</nav>