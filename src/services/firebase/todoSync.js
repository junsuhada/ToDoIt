import { collection, deleteDoc, doc, getDocsFromServer, onSnapshot, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from './client';

function todoCollection() {
  const { firestore, spaceId } = getFirebaseClient();
  return collection(firestore, 'mp3_spaces', spaceId, 'todos');
}

function parseSnapshot(snapshot) {
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      title: data.title,
      completed: data.completed,
      updatedAt: data.updatedAt,
    };
  });
}

export function watchServerTodos(onData, onError) {
  return onSnapshot(
    todoCollection(),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      onData(parseSnapshot(snapshot));
    },
    onError
  );
}

export async function fetchServerTodos() {
  const snapshot = await getDocsFromServer(todoCollection());
  return parseSnapshot(snapshot);
}

export async function uploadTodo(todo) {
  const ref = doc(todoCollection(), todo.id);
  if (todo.deleted) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, {
      title: todo.title,
      completed: todo.completed,
      updatedAt: todo.updatedAt,
    });
  }
}
