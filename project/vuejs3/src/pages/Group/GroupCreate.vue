<template>
    <div>
        <h2 class="title">Create Group</h2>
        
        <GroupForm :data="data" :actionType="actionType"/>
    </div>
</template>

<script>
    import GroupForm from '../../components/Group/GroupForm.vue'

    export default {
        name: 'GroupCreate',
        components: {
            GroupForm
        },
        data: function() {
            return {
                data: {},
                actionType: 'create'
            }
        }
    }

</script>