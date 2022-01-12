<script>
    import { useNavigate, useLocation } from "svelte-navigator"
  
    const navigate = useNavigate()
    const location = useLocation()
  
    $: if (window.localStorage.getItem('jwtToken') === null) {
        navigate("/admin/login", {
            state: { from: $location.pathname },
            replace: true,
        });
    }
</script>
  
<slot />