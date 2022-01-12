<script>
    import { onMount } from 'svelte'
    import Axios from 'axios'
    import Error422 from "../Error/Error422.svelte"
    import GroupList from "../../components/Group/GroupList.svelte"

    import { limit as limit_value} from '../../store/store'
    
    let limit; 

    limit_value.subscribe(value => {
		limit = value;
	});

    let isLoading = true
    let isError = null
    let groups = {}
    
	onMount(async () => {
        getData()
    })

    function getData() {
        let page = 1

        if(Object.keys(groups).length !== 0) {
            page = groups.nextPage
        }

        Axios
        .get(`http://localhost:8000/groups?page=${page}&limit=${limit}`)
        .then((res) => {
            let groupsList = []

            if(groups.docs !== undefined) {
                groupsList = groups.docs
            }  

            let newObject = {
                ...res.data,
                docs: groupsList.concat(res.data.docs)
            }
            groups = newObject
            isLoading = false
        })
        .catch((err) => {
            isError = err.response.status
            isLoading = false
        })
    }
    
    function handleMoreButton() {
        getData()
    }
</script>

{#if isLoading === false && isError === null}
    <h1 class="title">Groups</h1>

    <GroupList groups={groups} showButtons={false} showPaginate={true} handleMoreButton={handleMoreButton}/>
{/if}

{#if isLoading === false && isError === 422}
    <Error422 />
{/if}