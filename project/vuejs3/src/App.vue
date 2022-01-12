<template>
    <div>
        <Navigation/>
        <router-view/>
    </div>
</template>

<script>
    import Navigation from './components/Layout/Navigation.vue'

    export default {
        name: 'App',
        components: {
            //Footer,
            Navigation
        }
    }
</script>