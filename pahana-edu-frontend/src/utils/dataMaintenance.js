import { api } from "../api/axios";

const CATEGORY_LIST = [
	"Fiction", "Science", "Business", "History", "Technology",
	"Philosophy", "Psychology", "Biography", "Self-Help", "Cooking"
];

function normalizeString(value) {
	return (value || "").toString().trim().toLowerCase();
}

function buildDuplicateKey(item) {
	const isbn = normalizeString(item.isbn);
	if (isbn) return `isbn:${isbn}`;
	const name = normalizeString(item.name);
	const author = normalizeString(item.author);
	return `name:${name}|author:${author}`;
}

export function dedupeArrayByBooks(items) {
	const seen = new Set();
	const out = [];
	for (const item of items) {
		const key = buildDuplicateKey(item);
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
}

async function tryGetAll() {
	// Try main endpoint first; fall back to alternatives
	const endpoints = [
		{ url: "/api/v1/items", params: { page: 0, size: 1000 } },
		{ url: "/api/v1/books", params: {} },
		{ url: "/api/products", params: {} }
	];
	for (const ep of endpoints) {
		try {
			const res = await api.get(ep.url, { params: ep.params });
			let data = [];
			if (Array.isArray(res.data)) data = res.data;
			else if (res.data?.content) data = res.data.content;
			else if (res.data) data = [res.data];
			return { items: data, listEndpoint: ep.url };
		} catch (_) {}
	}
	return { items: [], listEndpoint: "/api/v1/items" };
}

async function tryDelete(id) {
	const candidates = [
		`/api/v1/items/${id}`,
		`/api/v1/books/${id}`,
		`/api/products/${id}`
	];
	for (const url of candidates) {
		try {
			await api.delete(url);
			return { success: true, url };
		} catch (_) {}
	}
	return { success: false };
}

async function tryAdd(book) {
	const candidates = ["/api/v1/items", "/api/v1/books", "/api/products"];
	for (const url of candidates) {
		try {
			const res = await api.post(url, book);
			return { success: true, id: res.data?.id, url };
		} catch (_) {}
	}
	return { success: false };
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateIsbn() {
	// Simple pseudo-ISBN generator
	const seg = () => String(randomInt(100, 999));
	return `${randomInt(900, 999)}-${seg()}-${seg()}-${seg()}`;
}

function generateBookForCategory(category, indexSeed = 0) {
	const num = Date.now() % 100000 + indexSeed;
	return {
		name: `${category} Book ${num}`,
		description: `Auto-generated ${category} book #${num}`,
		author: `${category} Author ${randomInt(1, 500)}`,
		unitPrice: randomInt(999, 4999), // cents
		stockQuantity: randomInt(3, 50),
		category,
		imageUrl: `https://picsum.photos/300/400?random=${randomInt(1000, 9999)}`,
		isbn: generateIsbn(),
		publisher: `${category} Press`,
		publicationYear: randomInt(1960, new Date().getFullYear())
	};
}

export async function removeDuplicateItems() {
	const result = { removed: 0, kept: 0, attempts: 0, errors: 0 };
	const { items } = await tryGetAll();
	const byKey = new Map();
	for (const it of items) {
		const key = buildDuplicateKey(it);
		if (!byKey.has(key)) byKey.set(key, []);
		byKey.get(key).push(it);
	}
	for (const group of byKey.values()) {
		// Sort stable: keep the earliest id if available
		group.sort((a, b) => (a.id ?? Infinity) - (b.id ?? Infinity));
		for (let i = 1; i < group.length; i += 1) {
			const dup = group[i];
			result.attempts += 1;
			const del = await tryDelete(dup.id);
			if (del.success) result.removed += 1; else result.errors += 1;
		}
		if (group.length > 0) result.kept += 1;
	}
	return result;
}

export async function fillCategoriesToMinimum(minPerCategory = 10) {
	const { items } = await tryGetAll();
	const counts = Object.fromEntries(CATEGORY_LIST.map(c => [c, 0]));
	for (const it of items) {
		const c = CATEGORY_LIST.find(cat => normalizeString(cat) === normalizeString(it.category));
		if (c) counts[c] += 1;
	}
	const additions = [];
	for (const cat of CATEGORY_LIST) {
		const need = Math.max(0, minPerCategory - (counts[cat] || 0));
		for (let i = 0; i < need; i += 1) {
			additions.push(generateBookForCategory(cat, i));
		}
	}
	const results = [];
	for (const book of additions) {
		const payload = { ...book };
		// Ensure unitPrice in cents
		payload.unitPrice = Number(payload.unitPrice);
		const r = await tryAdd(payload);
		results.push({ ...r, book: payload.name, category: payload.category });
		// Gentle rate limit
		await new Promise(res => setTimeout(res, 150));
	}
	return { created: results.filter(r => r.success).length, attempted: results.length, results };
}


