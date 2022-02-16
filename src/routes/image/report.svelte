<script>
  import { page } from '$app/stores';
  import Api from "$lib/api";


  export let votes = {};
  export let editable = false;
  export let confirm = false;

  function remove(key) {
    delete votes[key];
    votes = votes;
  }
  
  function partidoFromKey(key){return key.split('|')[0]}
  function candidatoFromKey(key){return key.split('|')[1];}

  let api = new Api();

  let promiseReport = Promise.resolve({});
  function handleReport(){
    promiseReport = api.report($page.params.imageid,votes);
    // window.location.href = '/myimages';
  }
</script>


{#if Object.entries(votes).length > 0}
<table class="table">
  <thead>
    <tr>
      <th scope="col">Partido</th>
      <th scope="col">Candidato</th>
      <th scope="col">Votos</th>
      {#if editable}
        <th scope="col"></th>        
      {/if}      
    </tr>
  </thead>
  <tbody>
  {#each Object.entries(votes) as [key,value]}
      <tr>
          <th scope="row">{partidoFromKey(key)}</th>
          <td>{candidatoFromKey(key)}</td>
          <td>{value}</td>
          {#if editable}
            <td><div on:click={remove(key)}>X</div></td>
          {/if}
      </tr>
  {/each}
  </tbody>
</table>   
{:else}
<h2>Ningún dato para esta imagen</h2>
{/if}
<hr/>
{#if editable}
<form on:submit|preventDefault={handleReport} >
  <div class="form-form-group row">
    <label for="confirm">Confirma estos datos?</label>
    <input type="checkbox" class="form-check-input" id="confirm" bind:value={confirm} />
  </div>
  <button type="submit" class="btn btn-primary" disabled={!confirm} >Enviar reporte</button>
</form>
{#await promiseReport}
<div class="alert alert-info mt-2">... Enviando ... </div>
{:catch error}
<div class="alert alert-danger mt-2">
  <div>
    {JSON.parse(error.message)}
  </div>
</div>
{/await}
{/if}      
