export interface TodoState {
    appId: string;
    todos: string[];
}

interface AddTodo {
    type: "add";
    todo: string;
}

interface DeleteTodo {
    type: "delete";
    index: number;
}

export type TodoAction = AddTodo | DeleteTodo;
export type SocketReceiver = (todo: string) => void;
