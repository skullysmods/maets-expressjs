import { listGames, createGame, getGameById, updateGameById, destroyGameById } from '../services/gameService.js';

export const index = async (req, res) => {
  try {
    const games = await listGames();
    res.status(200).json({ msg: "All games.", games: games });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const show = async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) throw new Error('Game Not Found');
    res.status(200).json({ msg: 'Game information', game: game });
  } catch (error) {
    if (error.message === "Game Not Found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body.name) throw new Error("Name required");
    const game = await createGame(req.body.name);
    res.status(201).json({ id: game.id, name: game.name });
  } catch (error) {
    if (error.message === "Name required") {
      res.status(400).json({ error: error.message });
    } else if (error.message === "Game already exist") {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const update = async (req, res) => {
  try {
    if (!req.body.name) throw new Error('Name required')
    const game = await updateGameById(req.params.id, req.body.name)
    res.status(200).json(game);
  } catch (error) {
    if (error.message === "Name required") {
      res.status(400).json({ error: error.message });
    } else if (error.message === "Game Not Found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const destroy = async (req, res) => {
  try {
    await destroyGameById(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === "Game Not Found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};