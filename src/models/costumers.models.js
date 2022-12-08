import joi from "joi";

const costumersSchema = joi.object({
  name: joi.string().required().min(3),
  phone: joi.string().required().min(11),
  cpf: joi.string().required().pattern(new RegExp("^d{3}.?d{3}.?d{3}-?d{2}$")),
  birthday: joi.string().required(),
});

export default costumersSchema;
