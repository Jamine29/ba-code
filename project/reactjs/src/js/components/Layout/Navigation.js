import React from 'react' 
import { Link } from 'react-router-dom' 

function Navigation() {
    
    const logout = () => {
        localStorage.removeItem('jwtToken') 
        window.location = 'http://localhost:3000/admin/login' 
    }

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/search">
                        <i className="material-icons">
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
                { localStorage.getItem('jwtToken') !== null &&
                    <li>
                        <Link to="/dashboard/account">
                            <i className="material-icons">
                                person
                            </i>
                        </Link>
                        <ul>
                            <li>
                                <Link to="/dashboard">
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/account">
                                    <span>My Account</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/artists/create">
                                    <span>Create Artist</span>
                                </Link>
                            </li>  
                            <li>
                                <Link to="/groups/create">
                                    <span>Create Group</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => { logout() }}>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                }
            </ul>
        </nav>
    ) 
}

export default Navigation 