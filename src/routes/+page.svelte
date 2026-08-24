<script lang="ts">
	import { onMount } from 'svelte';

	type ExpenseSummary = { totalSpend: number; currency: string; period: string };

	let summary = $state<ExpenseSummary | null>(null);
	let loading = $state(true);
	let error = $state('');

	const formatMoney = (amount: number, currency: string) =>
		new Intl.NumberFormat('en-IN', {
			style: 'currency', currency, maximumFractionDigits: 0
		}).format(amount);

	async function loadSummary() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/summary');
			if (!response.ok) throw new Error('Unable to load your summary');
			summary = await response.json();
		} catch (cause) {
			summary = null;
			error = cause instanceof Error ? cause.message : 'Something went wrong';
		} finally {
			loading = false;
		}
	}

	onMount(loadSummary);
</script>

<svelte:head>
	<title>Expense summary</title>
	<meta name="description" content="A simple view of your expense summary" />
</svelte:head>

<main>
	<section class="shell" aria-labelledby="page-title">
		<header>
			<div class="mark" aria-hidden="true">₹</div>
			<div>
				<p class="eyebrow">Personal expenses</p>
				<h1 id="page-title">Your summary</h1>
			</div>
		</header>

		<div class="summary-card" aria-live="polite">
			{#if loading}
				<div class="skeleton short"></div>
				<div class="skeleton amount"></div>
			{:else if error}
				<p class="error-title">We couldn’t load your expenses</p>
				<p class="error-message">{error}</p>
				<button onclick={loadSummary}>Try again</button>
			{:else if summary}
				<p class="period">{summary.period}</p>
				<p class="total">{formatMoney(summary.totalSpend, summary.currency)}</p>
				<p class="caption">Total spent</p>
			{/if}
		</div>

		<p class="hint">Send an expense in WhatsApp and return here to see it reflected.</p>
	</section>
</main>

<style>
	:global(*) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		background: #f4f6f1;
		color: #14231a;
		font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}
	main { min-height: 100svh; display: grid; place-items: start center; padding: 2rem 1rem; }
	.shell { width: min(100%, 30rem); }
	header { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem; }
	.mark {
		display: grid; width: 2.75rem; height: 2.75rem; place-items: center;
		border-radius: 0.9rem; background: #176b45; color: white; font-size: 1.25rem; font-weight: 700;
	}
	.eyebrow, h1, .period, .total, .caption, .hint, .error-title, .error-message { margin: 0; }
	.eyebrow {
		color: #5f6f64; font-size: 0.78rem; font-weight: 650;
		letter-spacing: 0.08em; text-transform: uppercase;
	}
	h1 { margin-top: 0.1rem; font-size: 1.5rem; letter-spacing: -0.03em; }
	.summary-card {
		min-height: 13.5rem; padding: 1.5rem; border: 1px solid #dfe5dc;
		border-radius: 1.4rem; background: white; box-shadow: 0 12px 32px rgb(24 61 39 / 8%);
	}
	.period, .caption { color: #657269; font-size: 0.9rem; }
	.total {
		margin-top: 0.65rem; font-size: clamp(2.5rem, 11vw, 4rem);
		font-weight: 750; letter-spacing: -0.06em; line-height: 1;
	}
	.caption { margin-top: 0.65rem; }
	.hint { padding: 1rem 0.5rem; color: #657269; font-size: 0.85rem; line-height: 1.5; text-align: center; }
	.error-title { font-size: 1.05rem; font-weight: 700; }
	.error-message { margin-top: 0.4rem; color: #657269; font-size: 0.9rem; }
	button {
		margin-top: 1.25rem; border: 0; border-radius: 0.75rem; background: #176b45;
		color: white; cursor: pointer; font: inherit; font-weight: 650; padding: 0.7rem 1rem;
	}
	.skeleton {
		border-radius: 0.5rem;
		background: linear-gradient(90deg, #edf0eb 25%, #f8f9f7 50%, #edf0eb 75%);
		background-size: 200% 100%; animation: pulse 1.3s infinite;
	}
	.skeleton.short { width: 6rem; height: 1rem; }
	.skeleton.amount { width: 70%; height: 3.8rem; margin-top: 1rem; }
	@keyframes pulse { to { background-position: -200% 0; } }
	@media (min-width: 40rem) {
		main { padding-top: 5rem; }
		.summary-card { padding: 2rem; }
	}
</style>
