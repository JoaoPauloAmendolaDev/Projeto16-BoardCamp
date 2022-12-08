import connection from "../server.js";

async function gamesGetterController(req, res) {
  try {
    const listOfGames = await connection.query("SELECT * FROM games");
    return res.send(listOfGames.rows).status(200);
  } catch (error) {
    return res.send(error).status(500);
  }
}

async function gamePostController(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.data;

  console.log(res.locals.data);
  try {
    const sucessInsert = await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    console.log(sucessInsert);
    res.sendStatus(201);
  } catch (error) {
    res.send(error).status(500);
  }
}

export { gamePostController, gamesGetterController };
