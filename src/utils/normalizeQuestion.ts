import type { Question } from '../store/quizStore';

const toTrimmedString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value).trim();
  }
  return '';
};

const toStringOr = (value: unknown, fallback = ''): string => {
  const result = toTrimmedString(value);
  return result || fallback;
};

const sanitizeOptions = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(option => toTrimmedString(option))
    .filter((option): option is string => option.length > 0);
};

/**
 * Convert raw question payloads into the internal Question shape while keeping backwards compatibility.
 */
export const normalizeQuestion = (raw: unknown, fallbackIndex = 0): Question => {
  const source = (typeof raw === 'object' && raw !== null)
    ? raw as Record<string, unknown>
    : {};

  const secenekler = sanitizeOptions(source.secenekler);
  const konu = toStringOr(source.konu ?? source.kategori ?? source.category, 'Genel');
  const zorluk = toStringOr(source.zorluk, 'Belirtilmedi');
  const tip = toTrimmedString(source.tip);
  const soruMetni = toStringOr(source.soruMetni);
  const aciklama = toStringOr(source.aciklama);
  const id = toStringOr(source.id, `auto-${fallbackIndex}`);
  const dogruCevapRaw = toTrimmedString(source.dogruCevap);
  const dogruCevapIndexRaw = typeof source.dogruCevapIndex === 'number' ? source.dogruCevapIndex : -1;

  const normalizedOptions = secenekler.map(option => option.toLowerCase());
  const normalizedAnswer = dogruCevapRaw.toLowerCase();

  let dogruCevapIndex = normalizedOptions.findIndex(option => option === normalizedAnswer);

  if (dogruCevapIndex === -1 && dogruCevapIndexRaw >= 0 && dogruCevapIndexRaw < secenekler.length) {
    dogruCevapIndex = dogruCevapIndexRaw;
  }

  if (dogruCevapIndex === -1 && secenekler.length > 0) {
    dogruCevapIndex = 0;
  }

  const safeIndex = secenekler.length > 0
    ? Math.max(0, Math.min(dogruCevapIndex, secenekler.length - 1))
    : 0;

  const dogruCevap = secenekler[safeIndex] ?? dogruCevapRaw;

  // Seçenekleri karıştır - her soru için tutarlı olması için id'ye göre seed kullan
  const shuffledOptions = [...secenekler];
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Fisher-Yates shuffle with seeded random
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  
  // Yeni doğru cevap index'ini bul
  const newCorrectIndex = shuffledOptions.indexOf(dogruCevap);

  return {
    id,
    konu,
    zorluk,
    tip: tip || undefined,
    soruMetni,
    secenekler: shuffledOptions.length ? shuffledOptions : dogruCevap ? [dogruCevap] : [],
    dogruCevap,
    dogruCevapIndex: newCorrectIndex >= 0 ? newCorrectIndex : safeIndex,
    aciklama
  };
};

export const normalizeQuestionArray = (input: unknown): Question[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item, index) => normalizeQuestion(item, index))
    .filter(question => question.id.length > 0 && question.soruMetni.length > 0 && question.secenekler.length > 0);
};
