<script>
    import Hello from './components/Hello.svelte'
    import { onMount } from 'svelte'

	import { count } from './stores/store.js'

    let count_value;

	count.subscribe(value => {
		count_value = value;
	});
 
    function increment() {
      count.update(n => n + 1);
    }
 
    function reset() {
      count.set(0);
    }
 
    export let name
 
    let defaultName = 'Jenni'
 
    onMount(async () => { console.log('mount') })
 
    function exampleMethode() { console.log('methode') }
</script>
 
<div class="title">
    {#if name !== ''}
        <h2>Hey, {name}.</h2>
    {:else}
        <Hello name={defaultName} />
    {/if}
</div>

<p>Count: {count_value}</p>

<button on:click={increment}>+</button>
 
<button on:click={reset}>Reset</button>

<style>
    h2 {
        color: blue;
    }

    .title {
        background-color: black;
    }
</style>