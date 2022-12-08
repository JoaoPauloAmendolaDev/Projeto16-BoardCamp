import joi from "joi";

const costumersSchema = joi.object({
  name: joi.string().required().min(3),
  phone: joi.string().required().min(11).alphanum(),
  cpf: joi.string().required().length(11),
  birthday: joi.date().required(),
});

export default costumersSchema;
