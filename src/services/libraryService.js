import { User, Game } from "../models/index.js";

export const getUserById = async (id) => {
  return User.findByPk(id);
};

export const getUserGamesById = async (id) => {
  return User.findByPk(id, { include: Game });
};

export const addGameToUser = async (user, game) => {
  return user.addGame(game);
};

export const isUserHasGame = async (user, game) => {
  return user.hasGame(game);
};

export const removeGameToUser = async (user, game) => {
  return user.removeGame(game);
};
