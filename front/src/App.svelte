<!-- https://eugenkiss.github.io/7guis/tasks#crud -->

<script>
	import { onMount } from 'svelte'

	let users = [];
	

	let email = '';
	let password = '';
	let i = 0;
	let prefix = '';

	$: filteredPeople = email
		? users.filter(user => {
			const name = `${user.email}, ${user.password}`;
			return name.toLowerCase().startsWith(prefix.toLowerCase());
		})
		: users;

	$: selected = filteredPeople[i];

	$: reset_inputs(selected);

	function create() {
		users = users.concat({ email: email, password: password });
		i = users.length - 1;
		email = password = '';
	}

	function update() {
		users[i] = { email: email, password: password };
	}

	function remove() {
		users = [...users.slice(0, i), ...users.slice(i + 1)];

		email = password = '';
		i = Math.min(i, users.length - 1);
	}

	function reset_inputs(person) {
		email = person ? person.first : '';
		password = person ? person.last : '';
	}

	onMount(async () => {
		const response = await fetch('http://localhost:8080/users', {
			headers: {
				'Content-Type': 'text/plain'
			}
		})
		let result = await response.json()
		users = result.data
	})

</script>

<style>
	* {
		font-family: inherit;
		font-size: inherit;
	}

	input {
		display: block;
		margin: 0 0 0.5em 0;
	}

	select {
		float: left;
		margin: 0 1em 1em 0;
		width: 14em;
	}

	.buttons {
		clear: both;
	}
</style>

<input placeholder="filter prefix" bind:value={prefix}>

<select bind:value={i} size={5}>
	{#each filteredPeople as user, i}
		<option value={i}>{user.password}, {user.email}</option>
	{/each}
</select>

<label><input bind:value={email} placeholder="email"></label>
<label><input bind:value={password} placeholder="password"></label>

<div class='buttons'>
	<button on:click={create} disabled="{!email || !password}">create</button>
	<button on:click={update} disabled="{!email || !password || !selected}">update</button>
	<button on:click={remove} disabled="{!selected}">delete</button>
</div>