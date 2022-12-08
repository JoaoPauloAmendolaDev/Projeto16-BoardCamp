import connection from "../server.js";

async function customersGetController(req, res) {
  try {
    const customersData = await connection.query("SELECT * FROM customers");
    res.status(200).send(customersData.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function customersPostController(req, res) {
  const { name, cpf, phone, birthday } = res.locals.data;

  try {
    await connection.query(
      "INSERT INTO customers (name, cpf, phone, birthday) VALUES ($1, $2, $3, $4)",
      [name, cpf, phone, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function customersGetOneController(req, res) {
  const { id } = req.params;

  try {
    const findOneCustomer = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (!findOneCustomer.rowCount) return res.sendStatus(404);
    res.status(200).send(findOneCustomer.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

export {
  customersPostController,
  customersGetController,
  customersGetOneController,
};
