import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Lightweight admin endpoint to view and reset model stats and queue length.
// This file accesses the same in-memory structures via import from the chat route file.

const STATS_PATH = path.resolve('.cache', 'model_stats.json');

export async function GET() {
  try {
    let stats: any = { usageCounts: {}, successModels: {}, queueLength: 0 };
    if (fs.existsSync(STATS_PATH)) {
      const raw = fs.readFileSync(STATS_PATH, 'utf8');
      try { stats = JSON.parse(raw); } catch (e) { /* ignore */ }
    }
    return NextResponse.json({ ok: true, stats });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Reset stats
  try {
    if (fs.existsSync(STATS_PATH)) fs.unlinkSync(STATS_PATH);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
