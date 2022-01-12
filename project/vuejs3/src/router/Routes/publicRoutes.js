import SignUp from '../../pages/Auth/SignUp.vue'
import Login from '../../pages/Auth/Login.vue'
import Group from '../../pages/Group/Group.vue'
import Artist from '../../pages/Artist/Artist.vue'
import Artists from '../../pages/Artist/Artists.vue'
import Groups from '../../pages/Group/Groups.vue'
import Search from '../../pages/Other/Search.vue'
import Home from '../../pages/Other/Home.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/admin/signup',
        name: 'signup',
        component: SignUp
    },
    {
        path: '/admin/login',
        name: 'login',
        component: Login
    }, 
    {
        path: '/groups',
        name: 'groups',
        component: Groups,
    },
    {
        path: '/groups/:id',
        name: 'groupsId',
        component: Group,
        props: true
    },
    {
        path: '/artists',
        name: 'artists',
        component:Artists
    },
    {
        path: '/artists/:id',
        name: 'artistsId',
        component: Artist,
        props: true
    },
    {
        path: '/search',
        name: 'search',
        component: Search
    }
]

export default routes.map(route => {
    let meta;
    if(route.path === '/admin/signup' || route.path === '/admin/login') {
        meta = {
            public: true,
            restricted: true
        }
    }
    else {
        meta = {
            public: true,
            restricted: false
        }
    }

    return { ...route, meta }
})