<template>
    <div>
        <div class="title">
            <h2 v-if="name !== ''">Hey, {{name}}.</h2>
            <Hello v-else :name="defaultName" />
        </div>

        <div>
            <p>Count: {{count}}</p>

            <button v-on:click="increment">+</button>
            
            <button v-on:click="reset">Reset</button>
        </div>
    </div>
</template>
 
<script>
    import Hello from './components/Hello.vue'
    import store from './vuex/store.js'
 
    export default {
        name: 'App',
        props: ['name'],
        data: () => { 
            return {
                defaultName: 'Jenni',
            }
        },
        components: {
            Hello
        },
        computed: {
            count() {
                return store.state.count
            }
        },
        mounted() { console.log('mount') },
        methods: {
            exampleMethode: function() { console.log('methode') },
            increment: function() {
                store.commit('increment');
            },
            reset: function() {
                store.commit('reset');
            }
        }
    }
</script>
      
<style>
    @import './greeting.css'
</style>