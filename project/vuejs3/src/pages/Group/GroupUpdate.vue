<template>
    <div>
        <div v-if="isLoading === false && isError === null">
            <h2 class="title">Update Group</h2>

            <GroupForm :data="data" :actionType="actionType" :id="id"/>
        </div>

            <Error422 v-if="isLoading === false && isError === 433"/>
    </div>
</template>

<script>
    import Axios from 'axios'
    import GroupForm from '../../components/Group/GroupForm.vue'
    import Error422 from '../Error/Error422.vue'

    export default {
        name: 'GroupUpdate',
        components: {
            GroupForm,
            Error422
        },
        props: ['id'],
        data: function() {
            return {
                data: {},
                isLoading: true,
                isError: null,
                actionType: 'update'
            }
        },
        mounted() {
            Axios
            .get(`http://localhost:8000/groups/${this.id}`)
            .then((res) => {
                this.data = res.data
                this.isLoading = false
            })
            .catch((err) => {
                this.isError = err.response.status
                this.isLoading = false
            })
        }
    }
</script>