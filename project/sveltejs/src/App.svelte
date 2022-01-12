<script>
	import { Router } from "svelte-navigator"
	import Routes from "./routes/Routes.svelte"
	import Navigation from './components/Layout/Navigation.svelte'
</script>
  
<Router>
	<header>
	  	<Navigation />
	</header>
  
	<main>
	  	<Routes />
	</main>
</Router>