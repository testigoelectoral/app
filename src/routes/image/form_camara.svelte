<script>
  import {camaraCandidatos, camaraPartidos, camaraCircunscripciones} from '$lib/data'

  export let votes = {};
  export let StateCode=16;
  
  let partido=null;
  let candidato=null;
  let votesCandidate=null;
  let circunscripcion="TERRITORIAL";

  let circunscripciones = ["DATOS MESA"].concat(camaraCircunscripciones(StateCode));
  $: partidos = updatePartidos(circunscripcion);
  $: candidatos = updateCandidatos(partido);


  function updatePartidos(circunscripcion){
    if (!circunscripcion) {
      return [];
    }

    if (circunscripcion=="DATOS MESA") {
      return ["DATOS MESA"];
    }

    return camaraPartidos(StateCode,circunscripcion);
  }
  
  function updateCandidatos(partido){
    const opcionesMesa = ["VOTOS EN BLANCO","VOTOS NO MARCADOS","VOTOS NULOS"]
    if (!partido) {
      return [];
    }

    if (partido=="DATOS MESA") {
      return opcionesMesa;
    }

    return ["VOTOS PARA LA LISTA"].concat(camaraCandidatos(StateCode,circunscripcion,partido))
  }
 
  function handleAdd() {
		votes[partido+"|"+candidato]=votesCandidate;
	}

  function onChangeCircunscripcion() {
    partido=null;
    candidato=null;
    votesCandidate=null
  }

  function onChangePartido() {
    candidato=null;
    votesCandidate=null
  }

  function onChangeCandidato() {
    votesCandidate=null
  }

</script>
<div class="mt-2 px-2 py-2 border-4 rounded border border-info">
	<form on:submit|preventDefault={handleAdd}>
    <div class="form-floating mb-3">
			<select
				type="select"
				class="form-control"
				id="circunscripcion"
				bind:value={circunscripcion}
				on:change={onChangeCircunscripcion}
			>
				{#each circunscripciones as t}
					<option value={t}>{t}</option>
				{/each}
			</select>
			<label for="Circunscripcion">Circunscripción:</label>
		</div>
    <div class="form-floating mb-3">
			<select
				type="select"
				class="form-control"
				id="partido"
				bind:value={partido}
				on:change={onChangePartido}
			>
				<option value="null" selected disabled>Seleccione un partido</option>
				{#each partidos as p}
					<option value={p}>{p}</option>
				{/each}
			</select>
			<label for="Partido">Partido:</label>
		</div>
		<div class="form-floating mb-3">
			<select
				type="select"
				class="form-control"
				id="candidato"
				bind:value={candidato}
				disabled={!partido}
				on:change={onChangeCandidato}
			>
				<option value="null" selected disabled>Seleccione un candidato</option>
				{#each candidatos as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
			<label for="Candidato">Candidato:</label>
		</div>
		<div class="form-floating mb-3">
			<input
				type="number"
				class="form-control"
				id="votos"
				bind:value={votesCandidate}
				disabled={!candidato}
			/>
			<label for="votos">Votos:</label>
		</div>
		<div class="d-grid gap-2">
			<button type="submit" class="btn btn-primary" disabled={!votesCandidate}>Agregar</button>
		</div>
	</form>
</div>
