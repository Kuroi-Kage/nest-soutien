import { describe, it, expect } from 'vitest';
import { PasswordService } from './password/password.service.js';


describe('PasswordService', () => {
  const service = new PasswordService();

  it('devrait hacher un mot de passe différemment de l\'original', async () => {
    const hash = await service.hash('MonMotDePasse123');
    expect(hash).not.toBe('MonMotDePasse123');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('devrait confirmer la correspondance avec le bon mot de passe', async () => {
    const hash = await service.hash('MonMotDePasse123');
    const matches = await service.compare('MonMotDePasse123', hash);
    expect(matches).toBe(true);
  });

  it('devrait rejeter un mauvais mot de passe', async () => {
    const hash = await service.hash('MonMotDePasse123');
    const matches = await service.compare('MauvaisMotDePasse', hash);
    expect(matches).toBe(false);
  });

  it('devrait générer un hash différent à chaque appel (salage aléatoire)', async () => {
    const hash1 = await service.hash('MêmeMotDePasse');
    const hash2 = await service.hash('MêmeMotDePasse');
    expect(hash1).not.toBe(hash2);
  });
});