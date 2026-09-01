import { NextResponse } from 'next/server';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { title, category } = await req.json();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ script: `HOOK\n${title}\n\nINTRO\nToday we're exploring ${title}.\n\nMAIN STORY\nExplain the key facts, context, examples and why this matters. Keep every factual claim sourced before publication.\n\nENDING\nIf you found this useful, follow for the next story.`, demo: true });
  }
  const model = process.env.AI_GATEWAY_API_KEY ? 'openai/gpt-5.5' : (await import('@ai-sdk/openai')).openai('gpt-5');
  const r = await generateText({ model: model as any, system: 'You are an expert video scriptwriter. No politics. Never invent facts. Clearly mark claims that require source verification.', prompt: `Write a 60-90 second original video script for ${category}: ${title}. Include hook, intro, 3-5 factual points, transitions and ending. Do not use copyrighted text.` });
  return NextResponse.json({ script: r.text });
}