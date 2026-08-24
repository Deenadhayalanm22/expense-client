import { json } from '@sveltejs/kit';

export function GET() {
	return json({ totalSpend: 12840, currency: 'INR', period: 'August 2026' });
}
