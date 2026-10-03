import { describe, it, expect, beforeEach } from 'vitest';
import { RiskService } from './risk.service.js';

describe('RiskService', () => {
  let service: RiskService;

  beforeEach(() => {
    service = new RiskService();
  });

  describe('assessMessage', () => {
    it('devrait détecter un risque critique', () => {
      const result = service.assessMessage("Je n'ai plus envie de vivre.");
      expect(result.level).toBe('CRITICAL');
      expect(result.matched).toBe(true);
    });

    it('devrait détecter un risque modéré', () => {
      const result = service.assessMessage('Je ne vais pas bien du tout en ce moment.');
      expect(result.level).toBe('MODERATE');
    });

    it('ne devrait détecter aucun risque sur un message neutre', () => {
      const result = service.assessMessage("J'ai bien mangé ce midi.");
      expect(result.level).toBe('NONE');
      expect(result.matched).toBe(false);
    });
  });

  describe('shouldEscalateToModerator', () => {
    it('devrait escalader pour HIGH et CRITICAL', () => {
      expect(service.shouldEscalateToModerator('HIGH' as any)).toBe(true);
      expect(service.shouldEscalateToModerator('CRITICAL' as any)).toBe(true);
    });

    it('ne devrait pas escalader pour NONE ou LOW', () => {
      expect(service.shouldEscalateToModerator('NONE' as any)).toBe(false);
      expect(service.shouldEscalateToModerator('LOW' as any)).toBe(false);
    });
  });

  describe('getEmergencyResources', () => {
    it('devrait renvoyer des ressources pour FR', () => {
      const resources = service.getEmergencyResources('FR');
      expect(resources.length).toBeGreaterThan(0);
    });

    it('devrait utiliser FR comme repli pour un pays inconnu', () => {
      expect(service.getEmergencyResources('XX')).toEqual(service.getEmergencyResources('FR'));
    });
  });
});