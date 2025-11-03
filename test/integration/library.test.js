import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/middlewares/auth.js', () => ({
  authRequired: (req, res, next) => {
    req.user = { id: 1, email: 'user@example.com' };
    next();
  },
  adminRequired: (req, res, next) => next(),
}));

const mockLibraryService = {
  addGameToUser: jest.fn(),
  getUserById: jest.fn(),
  getUserGamesById: jest.fn(),
  isUserHasGame: jest.fn(),
  removeGameToUser: jest.fn(),
};

const mockGameService = {
  getGameById: jest.fn(),
  getGameByName: jest.fn(),
};

await jest.unstable_mockModule('../../src/services/libraryService.js', () => mockLibraryService);
await jest.unstable_mockModule('../../src/services/gameService.js', () => mockGameService);

const libraryRouter = (await import('../../src/routes/library.js')).default;

const app = express();
app.use(express.json());
app.use('/users', libraryRouter);

describe('🔗 Library Routes (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/:id/library', () => {
    it('retourne la liste des jeux de l’utilisateur (200)', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        Games: [
          { id: 2, name: 'Zelda' },
          { id: 1, name: 'Mario' },
        ],
      };
      mockLibraryService.getUserGamesById.mockResolvedValue(mockUser);

      const res = await request(app).get('/users/1/library');

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toBe('Your games list.');
      expect(res.body.you.games).toEqual([
        { id: 1, name: 'Mario' },
        { id: 2, name: 'Zelda' },
      ]);
      expect(mockLibraryService.getUserGamesById).toHaveBeenCalledWith(1);
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserGamesById.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get("/users/1/library");
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('POST /users/:id/library', () => {
    it('ajoute un jeu à la bibliothèque (201)', async () => {
      const mockUser = { id: 1, email: 'user@example.com' };
      const mockGame = { id: 2, name: 'Zelda' };

      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameByName.mockResolvedValue(mockGame);
      mockLibraryService.isUserHasGame.mockResolvedValue(false);
      mockLibraryService.addGameToUser.mockResolvedValue();

      const res = await request(app)
        .post('/users/1/library')
        .send({ name: 'Zelda' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        userId: 1,
        game: { id: 2, name: 'Zelda' },
      });
    });

    it('retourne 404 si user ou game inexistant', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameByName.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .post('/users/1/library')
        .send({ name: 'Zelda' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 409 si user possède déjà le jeu', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameByName.mockResolvedValue({ id: 2 });
      mockLibraryService.isUserHasGame.mockResolvedValue(true);

      const res = await request(app)
        .post('/users/1/library')
        .send({ name: 'Zelda' });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('User already own this game');
    });

    it('retourne 500 pour toute autre erreur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/users/1/library')
        .send({ name: 'Zelda' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('DELETE /users/:userId/library/:gameId', () => {
    it('supprime un jeu de la bibliothèque (204)', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 2 };

      mockLibraryService.getUserById.mockResolvedValue(mockUser);
      mockGameService.getGameById.mockResolvedValue(mockGame);
      mockLibraryService.isUserHasGame.mockResolvedValue(true);
      mockLibraryService.removeGameToUser.mockResolvedValue();

      const res = await request(app).delete('/users/1/library/2');
      expect(res.statusCode).toBe(204);
    });

    it('retourne 404 si user ou game introuvable', async () => {
      mockLibraryService.getUserById.mockResolvedValue(null);
      mockGameService.getGameById.mockResolvedValue({});

      const res = await request(app).delete('/users/1/library/2');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User or Game Not Found');
    });

    it('retourne 404 si user ne possède pas le jeu', async () => {
      mockLibraryService.getUserById.mockResolvedValue({ id: 1 });
      mockGameService.getGameById.mockResolvedValue({ id: 2 });
      mockLibraryService.isUserHasGame.mockResolvedValue(false);

      const res = await request(app).delete('/users/1/library/2');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User does not has this game.');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockLibraryService.getUserById.mockRejectedValue(new Error('DB error'));

      const res = await request(app).delete('/users/1/library/2');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });
});
