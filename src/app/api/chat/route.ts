import { NextResponse } from 'next/server';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const API_KEY = process.env.OPENROUTER_API_KEY;

const failedModels = new Map();
const successModels = new Map();
const usageCounts = new Map();
const COOLDOWN_MS = 60 * 1000;

import fs from 'fs';
import path from 'path';
const STATS_PATH = path.resolve('.cache', 'model_stats.json');
try { fs.mkdirSync(path.dirname(STATS_PATH), { recursive: true }); } catch (e) {}

let redisClient: any = null;
const REDIS_URL = process.env.REDIS_URL || null;
if (REDIS_URL) {
  try {
    const Redis = require('ioredis');
    redisClient = new Redis(REDIS_URL);
  } catch (e) {
    console.error('Failed to initialize Redis client', e);
    redisClient = null;
  }
}

async function loadStats() {
  if (redisClient) {
    try {
      const raw = await redisClient.get('acreetionos_tracker_model_stats');
      if (raw) {
        const json = JSON.parse(raw);
        if (json?.usageCounts) Object.entries(json.usageCounts).forEach(([k, v]) => usageCounts.set(k, v as number));
        if (json?.successModels) Object.entries(json.successModels).forEach(([k, v]) => successModels.set(k, v as number));
      }
      return;
    } catch (e) {
      console.error('Failed to load stats from Redis', e);
    }
  }

  try {
    if (fs.existsSync(STATS_PATH)) {
      const raw = fs.readFileSync(STATS_PATH, 'utf8');
      const json = JSON.parse(raw);
      if (json?.usageCounts) Object.entries(json.usageCounts).forEach(([k, v]) => usageCounts.set(k, v as number));
      if (json?.successModels) Object.entries(json.successModels).forEach(([k, v]) => successModels.set(k, v as number));
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
}

async function saveStats() {
  const obj: any = { usageCounts: {}, successModels: {} };
  usageCounts.forEach((v, k) => obj.usageCounts[k] = v);
  successModels.forEach((v, k) => obj.successModels[k] = v);

  if (redisClient) {
    try {
      await redisClient.set('acreetionos_tracker_model_stats', JSON.stringify(obj), 'EX', 60 * 60);
      return;
    } catch (e) {
      console.error('Failed to save stats to Redis', e);
    }
  }

  try {
    fs.writeFileSync(STATS_PATH, JSON.stringify(obj), 'utf8');
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

loadStats();
setInterval(saveStats, 30_000);

const retryQueue: any[] = [];
const MAX_QUEUE = 1000;

async function processQueue() {
  while (retryQueue.length > 0) {
    const job = retryQueue.shift();
    if (!job) break;
    const { messages, attemptsWanted = 6 } = job;
    const models = await fetchModelsList();
    const candidates = pickCandidates(models).slice(0, attemptsWanted);
    for (const m of candidates) {
      try {
        const res = await tryModel(m, messages);
        usageCounts.set(m, (usageCounts.get(m) || 0) + 1);
        if (res.ok) {
          successModels.set(m, Date.now());
          break;
        } else {
          failedModels.set(m, Date.now());
        }
      } catch (e) {
        failedModels.set(m, Date.now());
      }
      await new Promise(r => setTimeout(r, 150 + Math.floor(Math.random()*200)));
    }
  }
}

setInterval(() => {
  if (retryQueue.length > 0) processQueue();
}, 10_000);

function enqueueWarmup(messages: any[], attemptsWanted = 6) {
  if (retryQueue.length > MAX_QUEUE) return;
  retryQueue.push({ messages, attemptsWanted });
}

async function fetchModelsList() {
  try {
    const resp = await fetch(`${OPENROUTER_BASE}/models`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 300 },
    });
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    console.error('Failed to fetch models list', e);
    return [];
  }
}

function pickCandidates(models: any[]) {
  const free = models.filter((m) => {
    if (!m || !m.id) return false;
    if (String(m.id).endsWith(':free')) return true;
    if (m.pricing && (m.pricing.prompt === 0 || m.pricing.completion === 0)) return true;
    return false;
  });

  const ids = Array.from(new Set(free.map((m) => String(m.id))));

  ids.sort((a, b) => {
    const ma = free.find((m) => m.id === a) || {};
    const mb = free.find((m) => m.id === b) || {};
    const ca = ma?.pricing?.upstream_inference_cost ?? ma?.upstream_inference_cost ?? 0;
    const cb = mb?.pricing?.upstream_inference_cost ?? mb?.upstream_inference_cost ?? 0;
    if (ca !== cb) return ca - cb;
    return a.length - b.length;
  });

  return ids;
}

async function tryModel(modelId: string, messages: any[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: modelId, messages }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await resp.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { /* ignore */ }
    return { ok: resp.ok, status: resp.status, json, raw: text };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: String(err) };
  }
}

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'OpenRouter API key is not configured on the server.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const systemPrompt = `You are Sprungles, a helpful and friendly bot for the AcreetionOS News Tracker. Your job is to help users understand Linux distro news, open source developments, security updates, and technical concepts by translating them into plain, easy-to-understand English. Be concise, supportive, and informative.`;

    const models = await fetchModelsList();
    let candidates = pickCandidates(models);

    const now = Date.now();
    candidates = candidates.filter((id) => {
      const lastFailed = failedModels.get(id) || 0;
      return now - lastFailed > COOLDOWN_MS;
    });

    if (candidates.length === 0) candidates.push('openrouter/free');

    const attempts: any[] = [];

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    const maxAttempts = Math.min(candidates.length, 12);
    for (let i = 0; i < maxAttempts; i++) {
      const modelId = candidates[i];
      const start = Date.now();
      const result = await tryModel(modelId, messages);
      const duration = Date.now() - start;
      const attemptMeta = { model: modelId, duration, ok: result.ok, status: result.status, error: result.error || (result.json && result.json.error) || null };
      attempts.push(attemptMeta);

      if (result.ok && result.json) {
        successModels.set(modelId, Date.now());
        failedModels.delete(modelId);
        const reply = result.json?.choices?.[0]?.message?.content || result.json?.choices?.[0]?.text || null;
        usageCounts.set(modelId, (usageCounts.get(modelId) || 0) + 1);
        saveStats();
        return NextResponse.json({ reply, model: modelId, attempts });
      } else {
        failedModels.set(modelId, Date.now());
      }
    }

    try {
      enqueueWarmup(messages, 6);
    } catch (e) { /* noop */ }

    return NextResponse.json({ error: 'All model attempts failed', attempts }, { status: 502 });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
