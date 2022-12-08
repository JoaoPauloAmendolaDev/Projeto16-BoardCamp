import rentalsSchema from "../models/rentals.models.js";
import connection from "../server.js";

async function rentalsPostMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const validation = rentalsSchema.validate(req.body, { abortEarly: false });

  if (daysRented <= 0) res.sendStatus(400);

  try {
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const customerExist = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );
    const gameExist = await connection.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );

    if (!customerExist.rowCount || !gameExist.rowCount) {
      return res.sendStatus(400);
    }

    res.locals.data = {
      ...req.body,
      originalPrice: gameExist.rows[0].pricePerDay,
    };

    next();
  } catch (error) {
    res.send(error).status(500);
  }
}

async function rentalsPostFinalMiddleware(req, res) {
  const { customerId, gameId, daysRented, originalPrice } = res.locals.data;
  console.log(res.locals.data);
}

export { rentalsPostFinalMiddleware, rentalsPostMiddleware };
