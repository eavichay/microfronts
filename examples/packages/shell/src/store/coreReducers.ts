import {AnyAction} from 'redux';

const createUUID = () => {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
};

export const coreReducers = {
    todos: ((state: any, action: AnyAction) => {
        switch (action.type) {
            case 'todo.check':
                const changedTodo: any = (state.todos || []).find((item: any) => item.id === action.id);
                if (changedTodo) {
                    changedTodo.done = action.done
                };
                return {
                    ...state
                }
            case 'todos.add':
                const todoItem = Object.assign({
                    id: createUUID(),
                    text: 'New Todo Item',
                    done: false
                }, action.todo)
                const todos = [...(state.todos || []), todoItem];
                return {
                    ...state,
                    todos,
                    total: todos.length
                }
            case 'todos.remove':
                const removeTodo = (state.todos || []).find((todoItem: any) => action.id === todoItem.id);
                if (removeTodo) {
                    const todos = state.todos.filter((todoItem: any) => todoItem !== removeTodo);
                    return {
                        ...state,
                        todos,
                        total: todos.length
                    }
                }
        }
        return {
            ...state
        };
    })
};