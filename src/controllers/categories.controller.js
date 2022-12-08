import connection from "../server.js";

async function categoriesGetterController(req, res) {
  try {
    const listOfCategories = await connection.query("SELECT * FROM categories");
    res.status(200).send(listOfCategories.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function categoriesPostController(req, res) {
  console.log("doidera hein");
  const name = res.locals.name;

  try {
    const sucess = await connection.query(
      "INSERT INTO categories (name) VALUES ($1) ",
      [name]
    );
    console.log(sucess);
    return res.send(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export { categoriesGetterController, categoriesPostController };
