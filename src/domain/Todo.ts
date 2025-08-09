/**
 * Todo domain entity
 * Represents a todo item with business rules and validation
 */
export class Todo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null = null,
    public readonly completed: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validateTitle();
  }

  /**
   * Validates the todo title according to business rules
   */
  private validateTitle(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Todo title cannot be empty");
    }

    if (this.title.length > 200) {
      throw new Error("Todo title cannot exceed 200 characters");
    }
  }

  /**
   * Marks the todo as completed
   */
  public markAsCompleted(): Todo {
    return new Todo(this.id, this.title, this.description, true, this.createdAt, new Date());
  }

  /**
   * Marks the todo as incomplete
   */
  public markAsIncomplete(): Todo {
    return new Todo(this.id, this.title, this.description, false, this.createdAt, new Date());
  }

  /**
   * Updates the todo with new information
   */
  public update(updates: {
    title?: string;
    description?: string | null;
    completed?: boolean;
  }): Todo {
    return new Todo(
      this.id,
      updates.title ?? this.title,
      updates.description !== undefined ? updates.description : this.description,
      updates.completed ?? this.completed,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Converts the Todo to a plain object for serialization
   */
  public toPlainObject(): {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
