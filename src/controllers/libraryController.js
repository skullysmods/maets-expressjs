import { addGameToUser, getUserById, getUserGamesById, isUserHasGame, removeGameToUser } from "../services/libraryService.js";
import { getGameById, getGameByName } from "../services/gameService.js";

export const getUserGames = async (req, res) => {
  try {
    const user = await getUserGamesById(req.user.id);
    res.status(200).json({
      msg: "Your games list.",
      you: {
        id: user.id,
        email: user.email,
        games: user.Games.sort((a, b) => a.id - b.id).map((game) => ({
          id: game.id,
          name: game.name,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addGameToLib = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    const game = await getGameByName(req.body.name);

    if (!user || !game) throw new Error('User or Game Not Found');
    if (await isUserHasGame(user, game)) throw new Error ('User already own this game')

    await addGameToUser(user, game);

    res.status(201).json({
      userId: user.id,
      game: {
        id: game.id,
        name: game.name,
      },
    });
    } catch (error) {
      if (error.message === "User or Game Not Found") {
        res.status(404).json({ error: error.message });
      } else if (error.message === "User already own this game") {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
};

export const removeGameToLib = async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    const game = await getGameById(req.params.gameId);
    if (!user || !game) throw new Error('User or Game Not Found');
    if (!(await isUserHasGame(user, game))) throw new Error('User does not has this game.');
    await removeGameToUser(user, game);
    res.status(204).end();
  } catch (error) {
    if (error.message === "User or Game Not Found") {
      res.status(404).json({ error: error.message });
    } else if (error.message === "User does not has this game.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
