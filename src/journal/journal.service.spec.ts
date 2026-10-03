import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalService } from './journal.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('JournalService', () => {
  let service: JournalService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      journalEntry: {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
        delete: vi.fn(),
      },
    };
    service = new JournalService(prismaMock as unknown as PrismaService);
  });

  it('devrait créer une entrée avec le contenu chiffré', async () => {
    prismaMock.journalEntry.create.mockResolvedValue({
      id: 'entry-1',
      userId: 'user-1',
      mood: 'BIEN',
      encryptedContent: 'donnee-chiffree-simulee',
      createdAt: new Date(),
    });

    const result = await service.create('user-1', { content: 'Bonne journée', mood: 'BIEN' as any });

    expect(prismaMock.journalEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'user-1', mood: 'BIEN' }),
    });
    expect(result.content).toBe('Bonne journée');
    expect(result.encryptedContent).toBeUndefined();
  });

  it('devrait refuser de supprimer une entrée qui n\'appartient pas à l\'utilisateur', async () => {
    prismaMock.journalEntry.findFirst.mockResolvedValue(null);

    await expect(service.remove('user-1', 'entry-dun-autre')).rejects.toThrow('introuvable');
  });

  it('devrait supprimer une entrée qui appartient bien à l\'utilisateur', async () => {
    prismaMock.journalEntry.findFirst.mockResolvedValue({ id: 'entry-1', userId: 'user-1' });
    prismaMock.journalEntry.delete.mockResolvedValue({});

    const result = await service.remove('user-1', 'entry-1');

    expect(prismaMock.journalEntry.delete).toHaveBeenCalledWith({ where: { id: 'entry-1' } });
    expect(result).toEqual({ success: true });
  });
});