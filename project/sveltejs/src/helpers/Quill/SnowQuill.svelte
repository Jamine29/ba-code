<svelte:head>
    <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>

<script>
    import { onMount } from "svelte"
    import Quill from "quill"
    import { modules } from "./snowLayout.js"

    export let content
    
    let newContent
    let editor
    let quill = null
      
    onMount(async () => {
        quill = new Quill(editor, {
            modules: {
                toolbar: modules
            },
            theme: "snow",
            placeholder:"Facts"  
        });
        quill.root.innerHTML = content
    });
</script>

<div class="editor-wrapper form-quill">
    <div bind:this={editor} on:text-change={e => newContent = e.detail}/>
</div>