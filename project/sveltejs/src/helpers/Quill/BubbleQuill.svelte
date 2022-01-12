<svelte:head>
    <link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet" />
</svelte:head>

<script>
    import { onMount } from "svelte"
    import Quill from "quill"
    import { modules } from "./snowLayout.js"
    export let content
    let newContent
  
    let editor;
    let quill = null
      
    onMount(async () => {
        quill = new Quill(editor, {
            modules: {
              toolbar: modules
            },
            theme: "bubble",
            readOnly: true    
        });
        quill.root.innerHTML = content
    });
</script>

<div class="editor-wrapper">
    <div bind:this={editor} on:text-change={e => newContent = e.detail}/>
</div>