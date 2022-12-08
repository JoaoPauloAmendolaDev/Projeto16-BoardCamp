import connection from "../server.js";
import costumersModel from "../models/costumers.models.js";
import costumersSchema from "../models/costumers.models.js";

async function costumersPostMiddleware(req, res, next) {
  const { cpf } = req.body;
  const validation = costumersSchema.validate(req.body, { abortEarly: false });

  try {
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const isCPFfound = await connection.query(
      "SELECT FROM customers WHERE cpf = $1",
      [cpf]
    );

    if (isCPFfound.rowCount) {
      return res.status(409).send("CPF already registered");
    }

    res.locals.data = req.body;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function customerPutMiddleware(req, res, next) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  const validation = costumersSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    const updateInfoUser = await connection.query(
      "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
      [name, phone, cpf, birthday, id]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export { costumersPostMiddleware, customerPutMiddleware };
