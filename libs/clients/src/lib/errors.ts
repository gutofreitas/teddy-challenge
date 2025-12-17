export class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client ${id} was not found`);
  }
}

export class ClientEmailTakenError extends Error {
  constructor(email: string) {
    super(`Client email ${email} is already in use`);
  }
}