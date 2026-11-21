export async function selectPendingTodos(db) {
  const rows = await db.getAllAsync(
    'SELECT id, title, completed, updatedAt, deleted FROM todos WHERE dirty = 1 ORDER BY updatedAt ASC'
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    updatedAt: row.updatedAt,
    deleted: row.deleted === 1,
  }));
}

export async function countPendingTodos(db) {
  const row = await db.getFirstAsync('SELECT COUNT(*) AS total FROM todos WHERE dirty = 1');
  return row.total;
}

export async function acknowledgeUpload(db, todo) {
  if (todo.deleted) {
    await db.runAsync(
      'DELETE FROM todos WHERE id = ? AND updatedAt = ? AND deleted = 1 AND dirty = 1',
      todo.id, todo.updatedAt
    );
  } else {
    await db.runAsync(
      'UPDATE todos SET dirty = 0 WHERE id = ? AND updatedAt = ? AND deleted = 0 AND dirty = 1',
      todo.id, todo.updatedAt
    );
  }
}

export async function mergeServerSnapshot(db, remoteTodos) {
  const localRows = await db.getAllAsync('SELECT id, dirty FROM todos');
  const localById = new Map(localRows.map((row) => [row.id, row]));
  const remoteIds = new Set();

  for (const remote of remoteTodos) {
    if (
      typeof remote.id !== 'string' || !remote.id ||
      typeof remote.title !== 'string' || !remote.title.trim() ||
      typeof remote.completed !== 'boolean' ||
      !Number.isFinite(remote.updatedAt)
    ) {
      throw new Error('Firebase 할 일 데이터 형식이 올바르지 않습니다.');
    }
    remoteIds.add(remote.id);
  }

  for (const remote of remoteTodos) {
    if (localById.get(remote.id)?.dirty === 1) continue;
    await db.runAsync(
      `INSERT INTO todos (id, title, completed, updatedAt, dirty, deleted)
       VALUES (?, ?, ?, ?, 0, 0)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         completed = excluded.completed,
         updatedAt = excluded.updatedAt,
         dirty = 0,
         deleted = 0
       WHERE todos.dirty = 0`,
      remote.id, remote.title, remote.completed ? 1 : 0, remote.updatedAt
    );
  }

  for (const local of localRows) {
    if (local.dirty === 0 && !remoteIds.has(local.id)) {
      await db.runAsync('DELETE FROM todos WHERE id = ? AND dirty = 0', local.id);
    }
  }
}
