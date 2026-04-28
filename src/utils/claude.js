// src/utils/claude.js
// AI helper — Google Gemini (primary) with Groq (free fallback).
// All requests go through Vite's dev proxy so API keys stay server-side.
// v4: Gemini 2.5 Flash primary, AI response caching, improved fallback chain.

const GEMINI_URL  = '/api/gemini';
const GROQ_URL    = '/api/groq';

// Gemini model fallback chain — 2.5 Flash is the latest and fastest
const GEMINI_MODELS = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

// Groq fallback model (free, no quota issues)
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const MAX_RETRIES   = 2;
const INITIAL_DELAY = 1500;

// ─── AI Response Cache ──────────────────────────────────────────────────────
const CACHE_KEY = 'scholarhub_ai_cache';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_MAX_ENTRIES = 50;

function getCacheKey(prompt, system) {
  // Simple hash for cache key
  const str = `${system}|||${prompt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  return `ai_${Math.abs(hash).toString(36)}`;
}

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
}

function getCachedResponse(prompt, system) {
  const cache = getCache();
  const key = getCacheKey(prompt, system);
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_MAX_AGE) {
    delete cache[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return null;
  }
  return entry.response;
}

function setCachedResponse(prompt, system, response) {
  const cache = getCache();
  const key = getCacheKey(prompt, system);
  cache[key] = { response, ts: Date.now() };
  // Evict oldest if over limit
  const keys = Object.keys(cache);
  if (keys.length > CACHE_MAX_ENTRIES) {
    const oldest = keys.sort((a, b) => cache[a].ts - cache[b].ts);
    for (let i = 0; i < keys.length - CACHE_MAX_ENTRIES; i++) {
      delete cache[oldest[i]];
    }
  }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* storage full */ }
}

export function clearAICache() {
  localStorage.removeItem(CACHE_KEY);
}

// ─── helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseGeminiError(status) {
  if (status === 429) return '429';           // signal: try Groq
  if (status === 403) return 'invalid_key';
  return `error_${status}`;
}

// Convert our message format → Gemini contents array
function toGeminiContents(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

function buildGeminiBody({ messages, system, maxTokens }) {
  const body = {
    contents: toGeminiContents(messages),
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  return body;
}

// Convert our message format → OpenAI/Groq messages array
function buildGroqBody({ messages, system, maxTokens }) {
  const msgs = [];
  if (system) msgs.push({ role: 'system', content: system });
  msgs.push(...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })));
  return { model: GROQ_MODEL, messages: msgs, max_tokens: maxTokens, temperature: 0.7 };
}

// ─── Gemini fetch with retry ─────────────────────────────────────────────────

async function fetchGemini(path, body) {
  let lastStatus = 500;
  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_URL}/${model}${path}`;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) return res;
      lastStatus = res.status;
      await res.text(); // drain body
      if (res.status === 404) break; // wrong model, try next
      if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
        await sleep(INITIAL_DELAY * Math.pow(2, attempt) + Math.random() * 300);
        continue;
      }
      break;
    }
  }
  return null; // all Gemini attempts failed — caller will try Groq
}

// ─── Groq fetch ──────────────────────────────────────────────────────────────

async function fetchGroq(endpoint, body) {
  const res = await fetch(`${GROQ_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 401) {
      throw new Error('❌ Groq API key missing or invalid.\n\nAdd GROQ_API_KEY to your .env file.\nGet a free key at https://console.groq.com');
    }
    throw new Error(`Groq error (${res.status}): ${txt.slice(0, 200)}`);
  }
  return res;
}

function groqUnavailable() {
  return new Error(
    '⚠️ AI quota exceeded on all providers.\n\n' +
    'Options:\n' +
    '1. Add a free Groq API key → https://console.groq.com → API Keys → Create\n' +
    '   Then add  GROQ_API_KEY=your_key  to your .env file and restart the dev server.\n\n' +
    '2. Or get a new free Gemini key → https://aistudio.google.com\n' +
    '   Replace GEMINI_API_KEY= in your .env and restart.'
  );
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Streaming call — yields tokens via onToken callback.
 * Uses cache for repeated prompts (returns instantly from cache).
 */
export async function callClaude(prompt, onToken, system = '', maxTokens = 800) {
  // Check cache first
  const cached = getCachedResponse(prompt, system);
  if (cached) {
    onToken(cached);
    return cached;
  }

  const geminiBody = buildGeminiBody({ messages: [{ role: 'user', content: prompt }], system, maxTokens });
  const geminiRes  = await fetchGemini(`:streamGenerateContent?alt=sse`, geminiBody);

  if (geminiRes) {
    const result = await streamGemini(geminiRes, onToken);
    setCachedResponse(prompt, system, result);
    return result;
  }

  // Groq fallback — non-streaming (Groq streaming works but adds complexity)
  const groqBody = buildGroqBody({ messages: [{ role: 'user', content: prompt }], system, maxTokens });
  let groqRes;
  try { groqRes = await fetchGroq('chat/completions', groqBody); }
  catch (err) { throw groqUnavailable(); }
  const data = await groqRes.json();
  const text = data?.choices?.[0]?.message?.content || '';
  onToken(text);
  setCachedResponse(prompt, system, text);
  return text;
}

/**
 * Non-streaming call — returns full response text.
 * Uses cache for repeated prompts.
 */
export async function callClaudeSync(prompt, system = '', maxTokens = 1000) {
  // Check cache first
  const cached = getCachedResponse(prompt, system);
  if (cached) return cached;

  const geminiBody = buildGeminiBody({ messages: [{ role: 'user', content: prompt }], system, maxTokens });
  const geminiRes  = await fetchGemini(`:generateContent`, geminiBody);

  if (geminiRes) {
    const data = await geminiRes.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    setCachedResponse(prompt, system, result);
    return result;
  }

  // Groq fallback
  const groqBody = buildGroqBody({ messages: [{ role: 'user', content: prompt }], system, maxTokens });
  let groqRes;
  try { groqRes = await fetchGroq('chat/completions', groqBody); }
  catch (err) { throw groqUnavailable(); }
  const data = await groqRes.json();
  const result = data?.choices?.[0]?.message?.content || '';
  setCachedResponse(prompt, system, result);
  return result;
}

/**
 * Multi-turn streaming chat (no caching — conversations are dynamic).
 */
export async function callClaudeChat(messages, system = '', onToken, maxTokens = 600) {
  const geminiBody = buildGeminiBody({ messages, system, maxTokens });
  const geminiRes  = await fetchGemini(`:streamGenerateContent?alt=sse`, geminiBody);

  if (geminiRes) {
    return streamGemini(geminiRes, onToken);
  }

  // Groq fallback
  const groqBody = buildGroqBody({ messages, system, maxTokens });
  let groqRes;
  try { groqRes = await fetchGroq('chat/completions', groqBody); }
  catch (err) { throw groqUnavailable(); }
  const data = await groqRes.json();
  const text = data?.choices?.[0]?.message?.content || '';
  onToken(text);
  return text;
}

// ─── Gemini SSE stream reader ─────────────────────────────────────────────────

async function streamGemini(res, onToken) {
  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) { full += text; onToken(full); }
      } catch { /* ignore malformed SSE lines */ }
    }
  }
  return full;
}



