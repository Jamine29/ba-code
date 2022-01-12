<script>
    import { useNavigate, useLocation } from "svelte-navigator";

    export let restricted;
  
    const navigate = useNavigate();
    const location = useLocation();

    $: if (window.localStorage.getItem('jwtToken') !== null && restricted === true ) {
        navigate("/dashboard", {
            state: { from: $location.pathname },
            replace: true,
        });
    }
</script>
  
<slot />