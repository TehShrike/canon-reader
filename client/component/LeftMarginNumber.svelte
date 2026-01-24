<script lang="ts">
interface Props {
	number: number
	id: string
	emphasized?: boolean
	hidden?: boolean
}

let { number, id, emphasized = false, hidden = false }: Props = $props()

const z_index = $derived(emphasized
	? 0
	: 0 - number)
</script>

<div class="placeholder">
	<!-- &#8203; -->
	<div
		class="number"
		data-emphasized={emphasized}
		data-hidden={hidden}
		style="z-index: {z_index}"
		id={id}
	>
		{number}
	</div>
</div>

<style>
.placeholder {
	float: left;
	width: 0;
}

.number {
	position: relative;
	left: -32px;
	margin: 0;
	font-family: var(--sans-serif);
	font-size: .7rem;
	color: var(--gray);
	display: flex;
	align-items: center;
	background-color: rgba(250,250,250,1);
	opacity: 1;
	width: 32px;
	user-select: none;
	-moz-user-select: none;
	-webkit-user-select: none;
}

[data-emphasized=true] {
	font-weight: bold;
	font-size: .9rem;
}

[data-hidden=true] {
	display: none;
}
</style>
