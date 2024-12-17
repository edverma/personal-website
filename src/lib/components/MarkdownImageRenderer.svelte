<script>
    export let href = "";
    export let title = undefined;
    export let text = "";
</script>

<br>
<img
class="w-[80%] h-auto display-block ml-auto mr-auto mt-10"
src={href}
{title}
alt={text}
/>
<p class="text-md text-gray-500 text-center">{text}</p>
<br>