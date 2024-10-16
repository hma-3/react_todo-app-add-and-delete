import { useCallback, useMemo, useState } from 'react';
import { ErrorMessages, StatusFilter, Todo } from '../types';
import { deleteTodo, getTodos } from '../api/todos';

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodosAmount, setActiveTodosAmount] = useState(0);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.DEFAULT,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const todosAmount = useMemo(() => todos.length, [todos]);

  const handleResetErrorMessage = useCallback(
    () => setErrorMessage(ErrorMessages.DEFAULT),
    [],
  );

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);
    setTimeout(handleResetErrorMessage, 3000);
  };

  const handleLoadTodos = () => {
    getTodos()
      .then(currentTodos => {
        setTodos(currentTodos);
      })
      .catch(() => handleError(ErrorMessages.LOADING_TODOS));
  };

  const handleDeleteTodo = (todoId: Todo['id']) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(curTodo => curTodo.id !== todoId),
        ),
      )
      .catch(() => handleError(ErrorMessages.DELETING_TODO))
      .finally(() =>
        setLoadingTodoIds(ids => ids.filter(currentId => currentId !== todoId)),
      );
  };

  const handleClearCompleted = () => {
    completedTodoIds.forEach(id => handleDeleteTodo(id));
  };

  return {
    todos,
    setTodos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    setTempTodo,
    activeTodosAmount,
    setActiveTodosAmount,
    setCompletedTodoIds,
    errorMessage,
    statusFilter,
    setStatusFilter,
    handleResetErrorMessage,
    handleError,
    handleLoadTodos,
    handleDeleteTodo,
    handleClearCompleted,
  };
};
