import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../interfaces/todo.interface";
import { v4 as uuidv4 } from "uuid";
export class TodoRepository {
  private todos: Todo[] = [
    {
      id: "1",
      title: "Learn Node.js",
      description: "Study Node.js fundamentals",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Build a REST API",
      description: "Use Express.js to create a robust API",
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Explore TypeScript",
      description: "Deep dive into TypeScript features and best practices",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Set up CI/CD",
      description: "Implement continuous integration and deployment pipelines",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  public getAllTodos(): Todo[] {
    return this.todos;
  }

  public getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  public createTodo(data: CreateTodoRequest): Todo {
    const newTodo: Todo = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  public updateTodo(id: string, data: UpdateTodoRequest): Todo | undefined {
    const todo = this.getTodoById(id);
    if (todo) {
      Object.assign(todo, {
        ...data,
        updatedAt: new Date(),
      });
    }
    return todo;
  }

  public deleteTodo(id: string): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
