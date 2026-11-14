import * as SQLite from 'expo-sqlite';
import {
  initializeTodoTable, selectTodos, insertTodo as insertRow,
  updateTodoTitle as updateTitle, toggleTodoCompleted as toggleRow,
  deleteTodo as deleteRow,
} from './todoRepository.mjs';

export const TODO_DATABASE_NAME = 'todo-it-mp2.db';
let databasePromise = null;

async function getDatabase() {
  if (databasePromise === null) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(TODO_DATABASE_NAME);
      await initializeTodoTable(db);
      return db;
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }
  return databasePromise;
}

export async function loadTodos() {
  return selectTodos(await getDatabase());
}

export async function addStoredTodo(todo) {
  return insertRow(await getDatabase(), todo);
}

export async function editStoredTodo(id, title) {
  return updateTitle(await getDatabase(), id, title);
}

export async function toggleStoredTodo(id) {
  return toggleRow(await getDatabase(), id);
}

export async function removeStoredTodo(id) {
  return deleteRow(await getDatabase(), id);
}
