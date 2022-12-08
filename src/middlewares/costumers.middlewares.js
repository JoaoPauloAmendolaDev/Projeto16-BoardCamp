import connection from "../server.js";
import costumersModel from "../models/costumers.models.js";
import costumersSchema from "../models/costumers.models.js";

async function costumersPostMiddleware(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const validation = costumersSchema.validate(req.body, { abortEarly });

  try {
  } catch (error) {}
}
