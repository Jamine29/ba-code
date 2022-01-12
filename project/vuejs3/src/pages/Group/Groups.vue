<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h1 class="title">Groups</h1>

            <GroupList :groups="groups" :showButtons="false" :showPaginate="true" :handleMoreButton="handleMoreButton"/>
        </div>
                
        <Error422 v-if="isLoading === false && isError === 422"/>
    </div>
</template>

<script>
    import Axios from 'axios'
    import GroupList from '../../components/Group/GroupList.vue'
    import Error422 from '../Error/Error422.vue'
    import store from '../../store/store.js'

    export default {
        name: "Groups",
        components: {
            GroupList,
            Error422
        },
        computed: {
            limit() {
                return store.state.limit
            }
        },
        data: function() {
            return {
                isLoading: true,
                groups: {},
                isError: null
            }
        },
        mounted() {
            Axios
            .get(`http://localhost:8000/groups?page=1&limit=${this.limit}`)
            .then((res) => {
                this.groups = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.response.status
                this.isLoading = false
            })
        },
        methods: {
            handleMoreButton: function() {
                Axios
                .get(`http://localhost:8000/groups?page=${this.groups.nextPage}&limit=${this.limit}`)
                .then((res) => {
                    let groupsList = this.groups.docs  
                    let newObject = {
                        ...res.data,
                        docs: groupsList.concat(res.data.docs)
                    }
                    this.groups = newObject
                })
                .catch((err) => {
                    this.isError = err.response.status
                    this.isLoading = false
                })
            }
        }
    }
</script>
