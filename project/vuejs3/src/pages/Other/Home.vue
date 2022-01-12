<template>
    <div class="flex-container-column height100">
        <p clasS="home-text">Find your Korean Idol.</p>

        <div class="button">
            <router-link :to="{name: 'search'}" class="button">
                Go
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home'
    }
</script>