// Pure, independently testable three-way sync decision based on server version.
// 'dirty' means local diverged from the last confirmed server version.
export function classify(local, remote) {
  if (!local) return remote ? 'pull' : 'none';
  if (local.dirty) return (remote?.version ?? 0) === local.baseVersion ? 'push' : 'conflict';
  return remote && remote.version > local.baseVersion ? 'pull' : 'none';
}
