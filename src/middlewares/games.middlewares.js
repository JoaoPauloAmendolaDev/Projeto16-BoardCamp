import gamesSchema from "../models/games.models.js";
import connection from "../server.js";

async function gamePostMiddleware(req, res, next) {
  const { name, categoryId } = req.body;
  const validation = gamesSchema.validate(req.body, { abortEarly: false });

  try {
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const categoryIdExist = await connection.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );
    const gameAlreadyInserted = await connection.query(
      "SELECT * FROM games WHERE name = $1",
      [name]
    );

    if (categoryIdExist.rows.length === 0) {
      return res.status(400).send("The indicated category does not exist");
    }

    if (gameAlreadyInserted.rows.length > 0) {
      return res.send(409).send("The game was already in database");
    }

    res.locals.data = req.body;

    next();
  } catch (error) {
    console.log('deu ruim', error)
    res.status(500).send(error);
  }
}

export { gamePostMiddleware };
