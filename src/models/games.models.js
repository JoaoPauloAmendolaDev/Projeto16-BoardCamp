import joi from "joi";

const gamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required().pattern(new RegExp("(https?://)")),
  stockTotal: joi.number().min(1).integer().required(),
  categoryId: joi.number().integer().required(),
  pricePerDay: joi.number().min(1).integer().required(),
});

export default gamesSchema;
