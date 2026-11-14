export async function initializeTodoTable(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL CHECK (length(trim(title)) > 0),
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1))
    );
  `);
}

export async function selectTodos(db) {
  const rows = await db.getAllAsync(
    'SELECT id, title, completed FROM todos ORDER BY rowid DESC'
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
  }));
}

export async function insertTodo(db, todo) {
  await db.runAsync(
    'INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)',
    todo.id, todo.title, todo.completed ? 1 : 0
  );
}

export async function updateTodoTitle(db, id, title) {
  await db.runAsync('UPDATE todos SET title = ? WHERE id = ?', title, id);
}

export async function toggleTodoCompleted(db, id) {
  await db.runAsync(
    'UPDATE todos SET completed = 1 - completed WHERE id = ?', id
  );
}

export async function deleteTodo(db, id) {
  await db.runAsync('DELETE FROM todos WHERE id = ?', id);
}
