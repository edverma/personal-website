import {base} from "$app/paths";

/** @type {import('./$types').PageLoad} */
export async function load({fetch, params}) {
	const res = await fetch('/posts/' + params.slug + '.md')
	const text = await res.text();
	return {text}
}