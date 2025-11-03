import { jest } from '@jest/globals';

const mockGameConfigModel = {
  findOne: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
};

await jest.unstable_mockModule('../../src/models/gameConfig.js', () => ({
  default: mockGameConfigModel,
}));

const {
  getGameConfigById,
  createGameConfig,
  updateGameConfigById,
  deleteGameConfigById,
} = await import('../../src/services/gameConfigService.js');

describe('GameConfig Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGameConfigById", () => {
    it("retourne une configuration de jeu par userId et gameId", async () => {
      const mockConfig = { userId: 1, gameId: 10, settings: { volume: 80 } };
      mockGameConfigModel.findOne.mockReturnThis();
      mockGameConfigModel.exec.mockResolvedValue(mockConfig);

      const result = await getGameConfigById(1, 10);

      expect(mockGameConfigModel.findOne).toHaveBeenCalledWith({
        userId: 1,
        gameId: 10,
      });
      expect(mockGameConfigModel.exec).toHaveBeenCalled();
      expect(result).toEqual(mockConfig);
    });
  });

  describe("createGameConfig", () => {
    it("crée une nouvelle configuration de jeu", async () => {
      const data = { userId: 1, gameId: 10, settings: { volume: 80 } };
      const mockConfig = { ...data, _id: "cfg123" };
      mockGameConfigModel.create.mockResolvedValue(mockConfig);

      const result = await createGameConfig(data);

      expect(mockGameConfigModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockConfig);
    });
  });

  describe("updateGameConfigById", () => {
    it("met à jour une configuration de jeu existante", async () => {
      const userId = 1;
      const gameId = 10;
      const data = { settings: { volume: 90 } };
      const updatedConfig = { userId, gameId, settings: data.settings };
      mockGameConfigModel.findOneAndUpdate.mockResolvedValue(updatedConfig);

      const result = await updateGameConfigById(userId, gameId, data);

      expect(mockGameConfigModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: userId, gameId, gameId },
        data,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedConfig);
    });
  });

  describe("deleteGameConfigById", () => {
    it("supprime une configuration de jeu existante", async () => {
      const userId = 1;
      const gameId = 10;
      const mockDeleted = { userId, gameId };
      mockGameConfigModel.findOneAndDelete.mockResolvedValue(mockDeleted);

      const result = await deleteGameConfigById(userId, gameId);

      expect(mockGameConfigModel.findOneAndDelete).toHaveBeenCalledWith({
        userId: userId,
        gameId: gameId,
      });
      expect(result).toEqual(mockDeleted);
    });
  });
});
