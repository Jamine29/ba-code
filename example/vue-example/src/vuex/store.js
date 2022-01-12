import { createStore } from 'vuex'

const store = createStore({
    state: {
        count: 0
    },
    mutations: {
        increment(state) {
            state.count++
        },
        reset(state) {
            state.count = 0
        } 
    }
})

export default store