import React, {useRef} from 'react';
import {useSelector} from 'react-redux';

import './App.css';

const store = AppContext.get('applicationState');
const addTodo = (text) => {
  store.dispatch({
    type: 'todos.add',
    todo: {
      text
    }
  });
};

const removeTodo = (id) => {
  store.dispatch({
    type: 'todos.remove',
    id
  });
}

const toggleTodo = (id, done) => {
  store.dispatch({
    type: 'todo.check',
    id,
    done
  });
}

const App = () => {
  const todos = useSelector(state => state.todos.todos);
  let newTodoInput = useRef();
  let list = todos ? todos.map(
    (todo, idx) =>
      <li key={idx}>
        <button onClick={() => removeTodo(todo.id)}>Remove</button>
        <input type="checkBox" checked={todo.done ? 'checked' : null} onChange={(event) => toggleTodo(todo.id, event.target.checked)}></input>{todo.text}
      </li>
    ) : [];
  return (
      <div className="App-header">
        HELLO, you have {todos.length} Items in your list.
        <div>
          <input ref={newTodoInput} type="text" placeholder="New Todo Item"></input><button onClick={() => {
            if (newTodoInput.current.value) {
              addTodo(newTodoInput.current.value);
              newTodoInput.current.value = '';
            }
          }}>Add Todo</button>
        </div>
        <br/>
        {list}
      </div>
  );
}

export default App;

// export default connect({
//   mapStateToProps: (state) => {todos: state.todos.todos}
// })(App);


    // <div>
    //   <div>
    //     This is the shared state
    //   </div>
    //   <div>
    //     Current user:
    //     <input type="text" autoselect value={username} onChange={(e) => setUsername(e.target.value)}></input>
    //   </div>
    //   <div>Number of clicks {clicks}</div><button onClick={() => setClicks(clicks+1)}>Click me!</button>
    // </div>