const unsupported = async () => {
  throw new Error('MP2 SQLite 버전은 Android 또는 iOS의 Expo Go에서 실행해 주세요. 웹 실행은 지원하지 않습니다.');
};

export const loadTodos = unsupported;
export const addStoredTodo = unsupported;
export const editStoredTodo = unsupported;
export const toggleStoredTodo = unsupported;
export const removeStoredTodo = unsupported;
