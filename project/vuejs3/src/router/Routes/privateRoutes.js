import Account from '../../pages/Account/Account.vue'
import Dashboard from '../../pages/Account/Dashboard.vue'
import ArtistCreate from '../../pages/Artist/ArtistCreate.vue'
import ArtistUpdate from '../../pages/Artist/ArtistUpdate.vue'
import GroupCreate from '../../pages/Group//GroupCreate.vue'
import GroupUpdate from '../../pages/Group//GroupUpdate.vue'

const routes = [
    {
        path: '/dashboard/account',
        name: 'dashboardAccount',
        component: Account
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/artists/create',
        name: 'artistsCreate',
        component: ArtistCreate
    },
    {
        path: '/artists/:id/update',
        name: 'artistsIdUpdate',
        component: ArtistUpdate,
        props: true
    },
    {
        path: '/groups/create',
        name: 'groupsCreate',
        component: GroupCreate
    },
    {
        path: '/groups/:id/update',
        name: 'groupsIdUpdate',
        component: GroupUpdate,
        props: true
    },
]

export default routes.map(route => {
    const meta = {
        public: false
    }
  return { ...route, meta }
})