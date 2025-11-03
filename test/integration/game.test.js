import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/middlewares/auth.js', () => ({
  authRequired: (req, res, next) => next(),
  adminRequired: (req, res, next) => next(),
}));

const mockGameService = {
  listGames: jest.fn(),
  createGame: jest.fn(),
  getGameById: jest.fn(),
  updateGameById: jest.fn(),
  destroyGameById: jest.fn(),
};

await jest.unstable_mockModule('../../src/services/gameService.js', () => mockGameService);

const gameRouter = (await import('../../src/routes/game.js')).default;

const app = express();
app.use(express.json());
app.use('/games', gameRouter);

describe('🔗 Game Routes (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /games', () => {
    it('retourne tous les jeux (200)', async () => {
      const games = [{ id: 1, name: 'Zelda' }];
      mockGameService.listGames.mockResolvedValue(games);

        const res = await request(app).get("/games");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ msg: 'All games.', games });
    });

    it('retourne 500 si une erreur survient', async () => {
      mockGameService.listGames.mockRejectedValue(new Error('DB Error'));

      const res = await request(app).get('/games');

      expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('GET /games/:id', () => {
    it('retourne un jeu existant (200)', async () => {
      const game = { id: 1, name: 'Zelda' };
      mockGameService.getGameById.mockResolvedValue(game);

      const res = await request(app).get('/games/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ msg: 'Game information', game });
    });

    it('retourne 404 si le jeu n’existe pas', async () => {
      mockGameService.getGameById.mockResolvedValue(null);

      const res = await request(app).get('/games/99');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Game Not Found');
    });

    it('retourne 500 pour toute autre erreur', async () => {
      mockGameService.getGameById.mockRejectedValue(new Error('DB Error'));

      const res = await request(app).get('/games/99');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('POST /games', () => {
    it('crée un jeu (201)', async () => {
      const newGame = { id: 1, name: 'Mario' };
      mockGameService.createGame.mockResolvedValue(newGame);

      const res = await request(app)
        .post('/games')
        .send({ name: 'Mario' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ id: 1, name: 'Mario' });
    });

    it('retourne 400 si le nom est manquant', async () => {
      const res = await request(app).post('/games').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Name required');
    });

    it('retourne 409 si le jeu existe déjà', async () => {
      mockGameService.createGame.mockRejectedValue(new Error('Game already exist'));

      const res = await request(app)
        .post('/games')
        .send({ name: 'Mario' });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe('Game already exist');
    });

    it('retourne 500 pour toute autre erreur', async () => {
      mockGameService.createGame.mockRejectedValue(new Error('DB Error'));

      const res = await request(app)
        .post('/games')
        .send({ name: 'Crash' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('PATCH /games/:id', () => {
    it('met à jour un jeu (200)', async () => {
      const updatedGame = { id: 1, name: 'Updated' };
      mockGameService.updateGameById.mockResolvedValue(updatedGame);

      const res = await request(app)
        .patch('/games/1')
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedGame);
    });

    it('retourne 400 si name manquant', async () => {
      const res = await request(app).patch('/games/1').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Name required');
    });

    it('retourne 404 si le jeu est introuvable', async () => {
      mockGameService.updateGameById.mockRejectedValue(new Error('Game Not Found'));

      const res = await request(app)
        .patch('/games/99')
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Game Not Found');
    });

    it('retourne 500 pour toute autre erreur', async () => {
      mockGameService.updateGameById.mockRejectedValue(new Error('DB Error'));

      const res = await request(app)
        .patch('/games/99')
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('DELETE /games/:id', () => {
    it('supprime un jeu (204)', async () => {
      mockGameService.destroyGameById.mockResolvedValue();

      const res = await request(app).delete('/games/1');

      expect(res.statusCode).toBe(204);
    });

    it('retourne 404 si le jeu est introuvable', async () => {
      mockGameService.destroyGameById.mockRejectedValue(new Error('Game Not Found'));

      const res = await request(app).delete('/games/99');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Game Not Found');
    });

    it('retourne 500 si erreur serveur', async () => {
      mockGameService.destroyGameById.mockRejectedValue(new Error('DB Error'));

      const res = await request(app).delete('/games/1');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });
});
