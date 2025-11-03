import { jest } from '@jest/globals';

const mockGameModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

await jest.unstable_mockModule('../../src/models/index.js', () => ({
  Game: mockGameModel,
}));

const {
  listGames,
  createGame,
  getGameById,
  getGameByName,
  updateGameById,
  destroyGameById,
} = await import('../../src/services/gameService.js');

describe('Game Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listGames', () => {
    it('doit retourner la liste des jeux ordonnée', async () => {
      const mockGames = [{ id: 1, name: 'Zelda' }];
      mockGameModel.findAll.mockResolvedValue(mockGames);

      const result = await listGames();
      expect(mockGameModel.findAll).toHaveBeenCalledWith({ order: [['id', 'ASC']] });
      expect(result).toEqual(mockGames);
    });
  });

  describe('createGame', () => {
    it('crée un jeu si le nom est unique', async () => {
      const mockGame = { id: 1, name: 'Mario' };
      mockGameModel.findOne.mockResolvedValue(null);
      mockGameModel.create.mockResolvedValue(mockGame);

      const result = await createGame('Mario');
      expect(mockGameModel.create).toHaveBeenCalledWith({ name: 'Mario' });
      expect(result).toEqual(mockGame);
    });

    it('lève une erreur si le jeu existe déjà', async () => {
      mockGameModel.findOne.mockResolvedValue({ id: 1, name: 'Mario' });
      await expect(createGame('Mario')).rejects.toThrow('Game already exist');
    });
  });

  describe('updateGameById', () => {
    it('met à jour un jeu existant', async () => {
      const mockGame = { id: 1, name: 'Old', save: jest.fn() };
      mockGameModel.findByPk.mockResolvedValue(mockGame);

      const result = await updateGameById(1, 'New');
      expect(mockGame.name).toBe('New');
      expect(mockGame.save).toHaveBeenCalled();
      expect(result).toBe(mockGame);
    });

    it('lève une erreur si le jeu n’existe pas', async () => {
      mockGameModel.findByPk.mockResolvedValue(null);
      await expect(updateGameById(1, 'New')).rejects.toThrow('Game Not Found');
    });
  });

  describe('destroyGameById', () => {
    it('supprime un jeu existant', async () => {
      const mockGame = { id: 1, destroy: jest.fn() };
      mockGameModel.findByPk.mockResolvedValue(mockGame);

      await destroyGameById(1);
      expect(mockGame.destroy).toHaveBeenCalled();
    });

    it('lève une erreur si le jeu n’existe pas', async () => {
      mockGameModel.findByPk.mockResolvedValue(null);
      await expect(destroyGameById(1)).rejects.toThrow('Game Not Found');
    });
  });
});
