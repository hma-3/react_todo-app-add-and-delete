import { useEffect } from 'react';

import { countLeftTodos, getCompletedTodoIds } from './utils';
import { useTodo } from './hooks/useTodo';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';

export const App: React.FC = () => {
  const {
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
  } = useTodo();

  useEffect(() => {
    handleResetErrorMessage();
    handleLoadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActiveTodosAmount(countLeftTodos(todos));
    setCompletedTodoIds(getCompletedTodoIds(todos));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          activeTodosAmount={activeTodosAmount}
          todosAmount={todosAmount}
          onError={handleError}
        />

        {!!todosAmount && (
          <>
            <TodoList
              todos={todos}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
              statusFilter={statusFilter}
              onDeleteTodo={handleDeleteTodo}
            />

            <TodoFooter
              leftTodos={activeTodosAmount}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              todosAmount={todosAmount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        errorMessage={errorMessage}
        onResetErrorMessage={handleResetErrorMessage}
      />
    </div>
  );
};
