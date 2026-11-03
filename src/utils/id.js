// 문서 식별용 ID다. 인증 토큰이나 보안용 비밀값으로 사용하지 않는다.
export function makeId() {
  const random = Math.random().toString(36).slice(2, 12);
  return `${Date.now().toString(36)}-${random}`;
}

export function compareVersion(a, b) {
  const timeDiff = Number(a.updated_at || 0) - Number(b.updated_at || 0);
  if (timeDiff !== 0) return timeDiff > 0 ? 1 : -1;
  const aDevice = String(a.updated_by || '');
  const bDevice = String(b.updated_by || '');
  return aDevice > bDevice ? 1 : aDevice < bDevice ? -1 : 0;
}

export function normalizeRoomCode(value) {
  return value.trim().toLowerCase();
}

export function isValidRoomCode(value) {
  return /^[a-z0-9][a-z0-9-]{7,63}$/.test(value);
}
