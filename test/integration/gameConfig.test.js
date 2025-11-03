import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/middlewares/auth.js', () => ({
  authRequired: (req, res, next) => {
    req.user = { id: 1, email: 'user@example.com' };
    next();
  },
}));

const mockGameConfigService = {
  getGameConfigById: jest.fn(),
  createGameConfig: jest.fn(),
  updateGameConfigById: jest.fn(),
  deleteGameConfigById: jest.fn(),
};

const mockGameService = {
  getGameById: jest.fn(),
};

const mockLibraryService = {
  getUserById: jest.fn(),
};

await jest.unstable_mockModule('../../src/services/gameConfigService.js', () => mockGameConfigService);
await jest.unstable_mockModule('../../src/services/gameService.js', () => mockGameService);
await jest.unstable_mockModule('../../src/services/libraryService.js', () => mockLibraryService);

const gameConfigRouter = (await import('../../src/routes/gameConfig.js')).default;

const app = express();
app.use(express.json());
app.use('/users', gameConfigRouter);

describe('🔗 GameConfig Routes (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/:userId/library/:gameId/config', () => {
    it('retourne la config d’un jeu (200)', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 2 };
      const mockConfig = { userId: 1, gameId: 2, volume: 80 };

      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameById.mockResolvedValue(mockGame);
      mockGameConfigService.getGameConfigById.mockResolvedValue(mockConfig);

      const res = await request(app).get('/users/1/library/2/config');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockConfig);
    });

    it('retourne 404 si user ou game introuvable', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameById.mockResolvedValue({});

      const res = await request(app).get('/users/1/library/2/config');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 404 si aucune config pour ce jeu', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameById.mockResolvedValue({ id: 2 });
      mockGameConfigService.getGameConfigById.mockResolvedValue(null);

      const res = await request(app).get('/users/1/library/2/config');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('No config for this game');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/users/1/library/2/config');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('POST /users/:userId/library/:gameId/config', () => {
    it('crée une config de jeu (201)', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 2 };
      const mockConfig = { userId: 1, gameId: 2, volume: 70 };

      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameById.mockResolvedValue(mockGame);
      mockGameConfigService.getGameConfigById.mockResolvedValue(null);
      mockGameConfigService.createGameConfig.mockResolvedValue(mockConfig);

      const res = await request(app)
        .post('/users/1/library/2/config')
        .send({ volume: 70 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockConfig);
    });

    it('retourne 404 si user ou game introuvable', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameById.mockResolvedValue({ id: 2 });

      const res = await request(app)
        .post('/users/1/library/2/config')
        .send({ volume: 50 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 409 si config déjà existante', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameById.mockResolvedValue({ id: 2 });
      mockGameConfigService.getGameConfigById.mockResolvedValue({ id: 'existing' });

      const res = await request(app)
        .post('/users/1/library/2/config')
        .send({ volume: 50 });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('User already have a config for this game');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));
      const res = await request(app)
        .post('/users/1/library/2/config')
        .send({ volume: 60 });
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('PATCH /users/:userId/library/:gameId/config', () => {
    it('met à jour une config existante (200)', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 2 };
      const mockUpdatedConfig = { userId: 1, gameId: 2, volume: 90 };

      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameById.mockResolvedValue(mockGame);
      mockGameConfigService.updateGameConfigById.mockResolvedValue(mockUpdatedConfig);

      const res = await request(app)
        .patch('/users/1/library/2/config')
        .send({ volume: 90 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUpdatedConfig);
    });

    it('retourne 404 si pas de config', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameById.mockResolvedValue({ id: 2 });
      mockGameConfigService.updateGameConfigById.mockResolvedValue(null);

      const res = await request(app)
        .patch('/users/1/library/2/config')
        .send({ volume: 50 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('No config for this game');
    });

    it('retourne 404 si user ou game introuvable', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameById.mockResolvedValue({ id: 2 });

      const res = await request(app)
        .patch('/users/1/library/2/config')
        .send({ volume: 70 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));
      const res = await request(app)
        .patch('/users/1/library/2/config')
        .send({ volume: 50 });
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('DELETE /users/:userId/library/:gameId/config', () => {
    it('supprime une config existante (204)', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 2 };
      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameById.mockResolvedValue(mockGame);
      mockGameConfigService.deleteGameConfigById.mockResolvedValue({ deleted: true });

      const res = await request(app).delete('/users/1/library/2/config');
      expect(res.statusCode).toBe(204);
    });

    it('retourne 404 si user ou game introuvable', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameById.mockResolvedValue({});

      const res = await request(app).delete('/users/1/library/2/config');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 404 si pas de config à supprimer', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameById.mockResolvedValue({ id: 2 });
      mockGameConfigService.deleteGameConfigById.mockResolvedValue(null);

      const res = await request(app).delete('/users/1/library/2/config');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('No config for this game');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));
      const res = await request(app).delete('/users/1/library/2/config');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });
});
