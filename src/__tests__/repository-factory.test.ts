import { TodoRepositoryFactory } from "../adapters/TodoRepositoryFactory";
import { InMemoryTodoRepository } from "../adapters/secondary/InMemoryTodoRepository";
import { PostgresTodoRepository } from "../adapters/secondary/PostgresTodoRepository";
import { TodoRepository } from "../domain/ports/TodoPorts";

describe("TodoRepositoryFactory", () => {
  let repositoryInstances: TodoRepository[] = [];

  beforeEach(() => {
    // Clear environment variables
    delete process.env.REPOSITORY_TYPE;
    repositoryInstances = [];
  });

  afterEach(async () => {
    // Clean up any repository instances created during tests
    for (const instance of repositoryInstances) {
      if (instance.close) {
        await instance.close();
      }
    }
    repositoryInstances = [];

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

  it("should create PostgresTodoRepository when REPOSITORY_TYPE is 'postgres'", async () => {
    process.env.REPOSITORY_TYPE = "postgres";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(PostgresTodoRepository);

    // Store for cleanup and test connection
    repositoryInstances.push(repository);
    if (repository.testConnection) {
      await repository.testConnection();
    }
  });

  it("should create PostgresTodoRepository when REPOSITORY_TYPE is 'postgresql'", async () => {
    process.env.REPOSITORY_TYPE = "postgresql";
    const repository = TodoRepositoryFactory.create();
    expect(repository).toBeInstanceOf(PostgresTodoRepository);

    // Store for cleanup and test connection
    repositoryInstances.push(repository);
    if (repository.testConnection) {
      await repository.testConnection();
    }
  });

  it("should create specific repository types using dedicated methods", async () => {
    const postgresRepo = TodoRepositoryFactory.createPostgres();
    expect(postgresRepo).toBeInstanceOf(PostgresTodoRepository);

    // Store for cleanup and test connection
    repositoryInstances.push(postgresRepo);
    if (postgresRepo.testConnection) {
      await postgresRepo.testConnection();
    }

    const memoryRepo = TodoRepositoryFactory.createInMemory();
    expect(memoryRepo).toBeInstanceOf(InMemoryTodoRepository);
  });
});
