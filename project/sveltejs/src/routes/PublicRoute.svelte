<script>
    import { Route } from "svelte-navigator"
    import PublicRouteGuard from "./PublicRouteGuard.svelte"

    export let path
    export let restricted
</script>

<Route {path} let:params let:location let:navigate>
    <PublicRouteGuard restricted={restricted}>
        <slot {params} {location} {navigate} />
    </PublicRouteGuard>
</Route>
