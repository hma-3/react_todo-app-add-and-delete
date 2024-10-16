import { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import './TodoHeader.scss';

import { ErrorMessages, Todo } from '../../types';
import { addTodo, USER_ID } from '../../api/todos';

interface Props {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  activeTodosAmount: number;
  todosAmount: number;
  onError: (message: ErrorMessages) => void;
}

export const TodoHeader: FC<Props> = ({
  setTodos,
  setTempTodo,
  activeTodosAmount,
  todosAmount,
  onError,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isFocusedInput, setIsFocusedInput] = useState(true);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocusedInput) {
      newTodoField.current?.focus();
    }
  }, [isFocusedInput, todosAmount]);

  const handleEndingSubmitForm = () => {
    setIsLoadingSubmit(false);
    setTempTodo(null);
    setIsFocusedInput(true);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle.length) {
      onError(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsLoadingSubmit(true);
    setTempTodo({ ...newTodo, id: 0 });
    setIsFocusedInput(false);

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => onError(ErrorMessages.ADDING_TODO))
      .finally(handleEndingSubmitForm);
  };

  return (
    <header className="todoapp__header">
      {!!todosAmount && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodosAmount === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isLoadingSubmit}
        />
      </form>
    </header>
  );
};
