import categoriesSchema from "../models/categories.models.js";
import connection from "../server.js";

async function categoriesPostMiddleware(req, res, next) {
  const { name } = req.body;
  const validation = categoriesSchema.validate(req.body);

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(`${errors}`);
  }

  try {
    const alreadyExist = await connection.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );

    if (alreadyExist.rows.length > 0) {
      return res.sendStatus(409);
    }
    res.locals.name = name;
    next();
  } catch (error) {
    res.sendStatus(500);
  }
}

export { categoriesPostMiddleware };
