import { TodoRepositoryFactory } from "../adapters/TodoRepositoryFactory";
import { InMemoryTodoRepository } from "../adapters/secondary/InMemoryTodoRepository";
import { PostgresTodoRepository } from "../adapters/secondary/PostgresTodoRepository";

describe("TodoRepositoryFactory", () => {
  beforeEach(() => {
    // Clear environment variables
    delete process.env.REPOSITORY_TYPE;
  });

  afterEach(() => {
    // Reset to default
    delete process.env.REPOSITORY_TYPE;
  });

  it("should create InMemoryTodoRepository by default", () => {
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(InMemoryTodoRepository);
  });

  it("should create InMemoryTodoRepository when REPOSITORY_TYPE is 'memory'", () => {
    process.env.REPOSITORY_TYPE = "memory";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(InMemoryTodoRepository);
  });

  it("should create InMemoryTodoRepository when REPOSITORY_TYPE is 'inmemory'", () => {
    process.env.REPOSITORY_TYPE = "inmemory";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(InMemoryTodoRepository);
  });

  it("should create PostgresTodoRepository when REPOSITORY_TYPE is 'postgres'", () => {
    process.env.REPOSITORY_TYPE = "postgres";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(PostgresTodoRepository);
  });

  it("should create PostgresTodoRepository when REPOSITORY_TYPE is 'postgresql'", () => {
    process.env.REPOSITORY_TYPE = "postgresql";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(PostgresTodoRepository);
  });

  it("should create specific repository types using dedicated methods", () => {
    const postgresRepo = TodoRepositoryFactory.createPostgres();
    expect(postgresRepo).toBeInstanceOf(PostgresTodoRepository);

    const memoryRepo = TodoRepositoryFactory.createInMemory();
    expect(memoryRepo).toBeInstanceOf(InMemoryTodoRepository);
  });
});
