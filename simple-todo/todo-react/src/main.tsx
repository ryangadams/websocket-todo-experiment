import React, {FormEvent, useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {SocketReceiver, TodoAction, TodoState} from "./types.ts";
import {socket} from "./socket.ts";


function reducer(state: TodoState, action: TodoAction) {
    switch (action.type) {
        case "add":
            return {
                appId: state.appId,
                todos: state.todos.concat(action.todo),
            }
        case "delete":
            // untested
            const todoList = [...state.todos];
            todoList.slice(action.index, 1)
            return {
                appId: state.appId,
                todos: todoList
            }
    }
}

const initialState: TodoState = {
    appId: crypto.randomUUID(),
    todos: []
}

function TodoApp() {
    const [todo, setTodo] = useState("");
    const [socketConnection, setSocketConnection] = useState<SocketReceiver | null>(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        // this needs to use the functional type otherwise it'll break
        setSocketConnection(() => socket.connect(state.appId, dispatch));
        // setSocketConnection(socket.connect(state.appId, dispatch)); // broken!
    }, []);

    const addTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!socketConnection) {
            console.log("no open socket");
            return;
        }
        socketConnection(todo);
        setTodo("");
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodo(e.target.value);
    }
    return <>
        <ul>{
            state.todos.map((todo, index) => <li key={index}>{todo}</li>)
        }
        </ul>
        <form onSubmit={addTodo}>
            <input type="text" value={todo} onChange={onChange}/>
            <button>Create Todo</button>
        </form>
    </>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TodoApp/>
    </React.StrictMode>,
)
