import { persistenceMemory } from './persistence-memory';

describe('persistenceMemory', () => {
  it('should work', () => {
    expect(persistenceMemory()).toEqual('persistence-memory');
  });
});
