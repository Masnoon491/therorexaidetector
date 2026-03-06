import type { ScanResults, AiBlock } from "@/types/scan";

export function normalizeResponse(data: any): ScanResults {
  const r = data?.results || data;
  const normalized: ScanResults = {};
  if (r?.ai) {
    const aiConf = r.ai.confidence?.AI ?? r.ai.score;
    const origConf = r.ai.confidence?.Original ?? (1 - (aiConf || 0));
    const classification = r.ai.classification?.AI === 1 ? "AI" : "Original";
    const blocks: AiBlock[] = [];
    if (Array.isArray(r.ai.blocks)) {
      for (const b of r.ai.blocks) {
        blocks.push({ text: b.text || "", fake: Number(b.result?.fake ?? b.fake ?? 0), real: Number(b.result?.real ?? b.real ?? 0) });
      }
    }
    normalized.ai = { score: Number(aiConf || 0), originalScore: Number(origConf || 0), classification, blocks };
  }
  if (r?.plagiarism?.score != null) normalized.plagiarism = { score: Number(r.plagiarism.score) };
  if (r?.readability) {
    const rd = r.readability.readability || {};
    const ts = r.readability.text_stats || {};
    normalized.readability = { fleschReadingEase: rd.fleschReadingEase, fleschGradeLevel: rd.fleschGradeLevel, gunningFoxIndex: rd.gunningFoxIndex, smogIndex: rd.smogIndex, avgReadingTime: ts.averageReadingTime, sentenceCount: ts.sentenceCount, wordCount: ts.uniqueWordCount };
  }
  if (Array.isArray(r?.grammarSpelling?.matches)) {
    normalized.grammar = r.grammarSpelling.matches.map((m: any) => ({ message: m.message || "", shortMessage: m.shortMessage || "", offset: m.offset || 0, length: m.length || 0, replacements: Array.isArray(m.replacements) ? m.replacements.slice(0, 3).map((rep: any) => (typeof rep === "string" ? rep : rep.value || "")) : [] }));
  }
  if (Array.isArray(r?.facts)) {
    normalized.facts = r.facts.map((f: any) => ({ fact: f.fact || "", truthfulness: f.truthfulness || "0%", explanation: f.explanation || "" }));
  }
  return normalized;
}
