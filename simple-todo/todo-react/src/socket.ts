import {io, Socket} from "socket.io-client";
import React from "react";
import {TodoAction} from "./types.ts";

export class SocketConnection {
    socket!: Socket;
    listeners: Record<string, React.Dispatch<TodoAction>> = {};

    constructor() {
        this.initialiseSocketConnection();
    }

    private initialiseSocketConnection() {
        this.socket = io("http://localhost:3000");
        this.socket.on("todo-received", (todo: string) => this.notify(todo));
    }

    /**
     * Send a message through this socket
     * 
     * @param todo
     */
    send = (todo: string) => {
        console.log("emitting a todo");
        this.socket.emit("todo", todo);
    }

    /**
     * Takes a unique identifier and a dispatch (from useReducer) and returns a function which can send messages
     * 
     * @param appId
     * @param listener
     */
    connect = (appId: string, listener: React.Dispatch<TodoAction>) => {
        this.listeners[appId] = (listener);
        return (todo: string) => this.send(todo)
    }

    /**
     * The client has received a message from the socket, broadcast to all listeners 
     * @param todo
     */
    notify = (todo: string) => {
        console.log("Got a new todo", todo);
        Object.values(this.listeners).forEach(listener => listener({type: "add", todo}));
    }

}

export const socket = new SocketConnection();

