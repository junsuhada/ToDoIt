export async function initializeTodoTable(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL CHECK (length(trim(title)) > 0),
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      updatedAt INTEGER NOT NULL DEFAULT 0,
      dirty INTEGER NOT NULL DEFAULT 1,
      deleted INTEGER NOT NULL DEFAULT 0
    );
  `);

  const columns = await db.getAllAsync('PRAGMA table_info(todos)');
  const names = new Set(columns.map((column) => column.name));
  if (!names.has('updatedAt')) {
    await db.execAsync('ALTER TABLE todos ADD COLUMN updatedAt INTEGER NOT NULL DEFAULT 0');
  }
  if (!names.has('dirty')) {
    await db.execAsync('ALTER TABLE todos ADD COLUMN dirty INTEGER NOT NULL DEFAULT 1');
  }
  if (!names.has('deleted')) {
    await db.execAsync('ALTER TABLE todos ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0');
  }
  await db.runAsync('UPDATE todos SET updatedAt = ? WHERE updatedAt = 0', Date.now());
}

export async function selectTodos(db) {
  const rows = await db.getAllAsync(
    'SELECT id, title, completed FROM todos WHERE deleted = 0 ORDER BY rowid DESC'
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
  }));
}

export async function insertTodo(db, todo) {
  await db.runAsync(
    'INSERT INTO todos (id, title, completed, updatedAt, dirty, deleted) VALUES (?, ?, ?, ?, 1, 0)',
    todo.id, todo.title, todo.completed ? 1 : 0, Date.now()
  );
}

export async function updateTodoTitle(db, id, title) {
  await db.runAsync(
    'UPDATE todos SET title = ?, updatedAt = MAX(updatedAt + 1, ?), dirty = 1 WHERE id = ? AND deleted = 0',
    title, Date.now(), id
  );
}

export async function toggleTodoCompleted(db, id) {
  await db.runAsync(
    'UPDATE todos SET completed = 1 - completed, updatedAt = MAX(updatedAt + 1, ?), dirty = 1 WHERE id = ? AND deleted = 0',
    Date.now(), id
  );
}

export async function deleteTodo(db, id) {
  await db.runAsync(
    'UPDATE todos SET deleted = 1, updatedAt = MAX(updatedAt + 1, ?), dirty = 1 WHERE id = ?',
    Date.now(), id
  );
}
