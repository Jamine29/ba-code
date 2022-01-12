<script>
    import GroupForm from "../../components/Group/GroupForm.svelte"

    let data = {}
    let actionType = "create"
</script>

<div>
    <h2 class="title">Create Group</h2>
    
    <GroupForm data={data} actionType={actionType} id={undefined}/>
</div>