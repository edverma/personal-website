<script>
	import snarkdown from "snarkdown";

	export let data;
</script>

<div>
	{@html snarkdown(data.text)}
</div>