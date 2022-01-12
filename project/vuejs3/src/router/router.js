import routes from './Routes/routes.js'
import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    let restricted = null;
    const authenticated = window.localStorage.getItem('jwtToken');
    const isPublic = to.matched.some(record => record.meta.public);

    if(isPublic) {
        restricted = to.matched.some(record => record.meta.restricted);
    }

    if (isPublic === false && authenticated === null) {    
        next({
           path: '/admin/signup'
        })
    }

    if(isPublic === true && restricted === true && authenticated !== null) {
        next({
            path: '/dashboard',
        })
    }
  
    next()
})

export default router