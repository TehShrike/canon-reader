<script lang="ts">
import StateLink from '#component/StateLink.svelte'
</script>

<div class="container">
	<h1>Canon Reader</h1>
	<p>
		A Bible reader
	</p>

	<StateLink
		state="main.book-selection"
		class_name="button button_primary read_button"
	>
		Read
	</StateLink>

	<h2>
		Three goals
	</h2>

	<div class="goals">
		<div class="goal">
			<h3>
				Quick navigation
			</h3>
			<p>
				Looking up references on my phone during worship or arguing with people on the internet on my desktop: I want to get to the verse quickly without faffing about.
			</p>
		</div>
		<div class="goal">
			<h3>
				Long reading
			</h3>
			<p>
				Chapter breaks and intrusive chapter and verse numbers are annoying.  Non-canonical headers offend me.
			</p>
			<p>
				Bookmarks that I can move forward to my current position help me keep track of daily reading.
			</p>
		</div>
		<div class="goal">
			<h3>
				Light study
			</h3>
			<p>
				I don't trust translators, but I don't know Hebrew or Greek, so when I'm reading a verse I want to see the original language with definitions.
			</p>
		</div>
	</div>

	<p>
		This project is in progress.  To see the code or report an issue, go to
		<a
			href="https://github.com/TehShrike/canon-reader"
			target="_blank"
			rel="external noopener"
		>Github</a>.
		There is also a basic
		<a
			href="https://github.com/TehShrike/canon-reader/blob/master/todo.md"
			target="_blank"
			rel="external noopener"
		>to-do list for the near future</a>.
	</p>
</div>

<style>
.container {
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
	padding-top: var(--default-padding);
	padding-bottom: var(--default-padding);
	text-align: center;
}

:global(.read_button) {
	width: 300px;
	max-width: 80%;
	height: 100px;
	font-size: 32px;
	margin-left: auto;
	margin-right: auto;
}

.goals {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
	margin-bottom: 16px;
}

.goal {
	font-size: 15px;
	flex-basis: 220px;
	min-width: 220px;
	max-width: 300px;
	margin: 8px;
	flex-grow: 1;
	padding: 0 16px;
	border: 1px solid var(--blue);
	border-radius: 5px;
}
</style>
