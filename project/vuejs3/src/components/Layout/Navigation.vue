<template>
    <nav>
        <ul>
            <li>
                <router-link :to="{name: 'search'}">
                    <i class="material-icons">
                        search
                    </i>
                </router-link>
            </li>
            <li>
                <router-link :to="{name: 'groups'}">
                    <span>Groups</span>
                </router-link>
            </li>
            <li>
                <router-link :to="{name: 'artists'}">
                        <span>Artists</span>
                </router-link>
            </li>
            <li v-if="token !== null">
                <router-link :to="{name:'dashboardAccount'}">
                    <i class="material-icons">
                        person
                    </i>
                </router-link>
                <ul>
                    <li>
                        <router-link class="nav-item" :to="{name: 'dashboard'}">
                            <span>Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="nav-item" :to="{name: 'dashboardAccount'}">
                            <span>My Account</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="nav-item" :to="{name: 'artistsCreate'}">
                            <span>Create Artist</span>
                        </router-link>
                    </li>  
                    <li>
                        <router-link class="nav-item" :to="{name: 'groupsCreate'}">
                            <span>Create Group</span>
                        </router-link>
                    </li>
                    <li>
                        <button class="nav-item nav-button" v-on:click="logout">
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: 'Navigation',
        data: function() {
            return {
                token: window.localStorage.getItem('jwtToken')
            }
        },
        methods: {
            logout: function() {
                localStorage.removeItem('jwtToken')
                window.location = 'http://localhost:8080/admin/login'
            }
        }
    }
</script>