import { jest } from '@jest/globals';

// --- Mocks partagés pour les modèles Sequelize ---
const mockUserModel = {
  findByPk: jest.fn(),
};
const mockGameModel = {};

// --- Simulation du module Sequelize ---
await jest.unstable_mockModule('../../src/models/index.js', () => ({
  User: mockUserModel,
  Game: mockGameModel,
}));

// --- Import du service APRÈS le mock ---
const {
  getUserById,
  getUserGamesById,
  addGameToUser,
  isUserHasGame,
  removeGameToUser,
} = await import('../../src/services/libraryService.js');

describe('Library Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------
  // getUserById
  // ------------------------------
  describe('getUserById', () => {
    it('retourne un utilisateur par ID', async () => {
      const mockUser = { id: 1, name: 'Alice' };
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await getUserById(1);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  // ------------------------------
  // getUserGamesById
  // ------------------------------
  describe('getUserGamesById', () => {
    it('retourne un utilisateur avec ses jeux', async () => {
      const mockUser = { id: 1, name: 'Alice', Games: [{ id: 10, name: 'Zelda' }] };
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await getUserGamesById(1);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, { include: mockGameModel });
      expect(result).toEqual(mockUser);
    });
  });

  // ------------------------------
  // addGameToUser
  // ------------------------------
  describe('addGameToUser', () => {
    it('ajoute un jeu à un utilisateur', async () => {
      const mockGame = { id: 10, name: 'Zelda' };
      const mockUser = { id: 1, addGame: jest.fn().mockResolvedValue(true) };

      const result = await addGameToUser(mockUser, mockGame);
      expect(mockUser.addGame).toHaveBeenCalledWith(mockGame);
      expect(result).toBe(true);
    });
  });

  // ------------------------------
  // isUserHasGame
  // ------------------------------
  describe('isUserHasGame', () => {
    it('vérifie si un utilisateur possède un jeu', async () => {
      const mockGame = { id: 10, name: 'Zelda' };
      const mockUser = { id: 1, hasGame: jest.fn().mockResolvedValue(true) };

      const result = await isUserHasGame(mockUser, mockGame);
      expect(mockUser.hasGame).toHaveBeenCalledWith(mockGame);
      expect(result).toBe(true);
    });
  });

  // ------------------------------
  // removeGameToUser
  // ------------------------------
  describe('removeGameToUser', () => {
    it('supprime un jeu de la bibliothèque d’un utilisateur', async () => {
      const mockGame = { id: 10, name: 'Zelda' };
      const mockUser = { id: 1, removeGame: jest.fn().mockResolvedValue(true) };

      const result = await removeGameToUser(mockUser, mockGame);
      expect(mockUser.removeGame).toHaveBeenCalledWith(mockGame);
      expect(result).toBe(true);
    });
  });
});
