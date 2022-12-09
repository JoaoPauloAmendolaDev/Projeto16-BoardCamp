import rentalsSchema from "../models/rentals.models.js";
import connection from "../server.js";

async function rentalsGetMiddleware(req, res, next) {
  let { customerId, gameId } = req.query;

  let newArr = [];

  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    const game = await connection.query("SELECT * FROM games WHERE id = $1;", [
      gameId,
    ]);

    if (!customer.rowCount && !game.rowCount) {
      console.log("entrei onde não vem nada");
      const allRentals = await connection.query("SELECT * FROM rentals;");

      for (let i = 0; i < allRentals.rowCount; i++) {
        let { customerId, gameId } = allRentals.rows[i];
        const customerOfRentals = await connection.query(
          "SELECT * FROM customers WHERE id = $1;",
          [customerId]
        );

        const gameOfRentals = await connection.query(
          "SELECT * FROM games WHERE id = $1;",
          [gameId]
        );

        const gameCategory = gameOfRentals.rows[0].categoryId;

        const categoryOfRentals = await connection.query(
          "SELECT * from categories WHERE id = $1;",
          [gameCategory]
        );

        newArr = [
          ...newArr,
          {
            ...allRentals.rows[0],
            customer: {
              id: customerOfRentals.rows[0].id,
              name: customerOfRentals.rows[0].name,
            },
            game: {
              id: gameOfRentals.rows[0].id,
              name: gameOfRentals.rows[0].name,
              categoryId: gameOfRentals.rows[0].categoryId,
              categoryName: categoryOfRentals.rows[0].name,
            },
          },
        ];
      }
      res.locals.filtered = newArr;
      return next();
    }

    if (!customer.rowCount) {
      const rentalsOfGame = await connection.query(
        'SELECT * FROM rentals WHERE "gameId" = $1;',
        [gameId]
      );

      console.log(rentalsOfGame.rows);

      for (let i = 0; i < rentalsOfGame.rows.length; i++) {
        console.log("rodei no for");
        let { customerId, gameId } = rentalsOfGame.rows[i];

        console.log(customerId);
        const customerOfRentals = await connection.query(
          "SELECT * FROM customers WHERE id = $1;",
          [customerId]
        );

        console.log(customerOfRentals.rows);
        //AQUI É O USUÁRIO COM TODOS OS DADOS CORRETOS

        const gameOfRentals = await connection.query(
          "SELECT * FROM games WHERE id = $1;",
          [gameId]
        );

        console.log(gameOfRentals.rows);
        //AQUI SÃO TODOS OS DADOS DO JOGO

        const gameCategory = gameOfRentals.rows[0].categoryId;

        const categoryOfRentals = await connection.query(
          "SELECT * from categories WHERE id = $1;",
          [gameCategory]
        );
        //AQUI É O NOME DA CATEGORIA DO JOGO

        newArr = [
          ...newArr,
          {
            ...rentalsOfGame.rows[i],
            customer: {
              id: customerOfRentals.rows[0].id,
              name: customerOfRentals.rows[0].name,
            },
            game: {
              id: gameOfRentals.rows[0].id,
              name: gameOfRentals.rows[0].name,
              categoryId: gameOfRentals.rows[0].categoryId,
              categoryName: categoryOfRentals.rows[0].name,
            },
          },
        ];

        console.log("aqui é o new arr", rentalsOfGame.rows[0]);
      }

      res.locals.filtered = newArr;
      return next();
    }

    if (!game.rowCount) {
      const allRentGamesOfCustomer = await connection.query(
        'SELECT * FROM rentals WHERE "customerId" = $1',
        [customerId]
      );

      console.log(allRentGamesOfCustomer.rows);

      for (let i = 0; i < allRentGamesOfCustomer.rowCount; i++) {
        let { customerId, gameId } = allRentGamesOfCustomer.rows[i];
        const customerOfRentals = await connection.query(
          "SELECT * FROM customers WHERE id = $1;",
          [customerId]
        );

        const gameOfRentals = await connection.query(
          "SELECT * FROM games WHERE id = $1;",
          [gameId]
        );

        const gameCategory = gameOfRentals.rows[0].categoryId;

        const categoryOfRentals = await connection.query(
          "SELECT * from categories WHERE id = $1;",
          [gameCategory]
        );

        newArr = [
          ...newArr,
          {
            ...allRentGamesOfCustomer.rows[i],
            customer: {
              id: customerOfRentals.rows[0].id,
              name: customerOfRentals.rows[0].name,
            },
            game: {
              id: gameOfRentals.rows[0].id,
              name: gameOfRentals.rows[0].name,
              categoryId: gameOfRentals.rows[0].categoryId,
              categoryName: categoryOfRentals.rows[0].name,
            },
          },
        ];
      }
      res.locals.filtered = newArr;
      return next();
    }
  } catch (error) {
    res.send(error).status(500);
  }
}

async function rentalsPostMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const validation = rentalsSchema.validate(req.body, { abortEarly: false });

  if (daysRented <= 0) res.sendStatus(400);

  try {
    if (validation.error) {
      console.log("erro de validação");
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
      console.log("não existe customer ou game");
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

  try {
    const isAvaibleGame = await connection.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );
    if (!isAvaibleGame.rows[0].stockTotal) return res.sendStatus(400);

    const postObject = {
      ...res.locals.data,
      stockTotal: isAvaibleGame.rows[0].stockTotal,
      rentDate: new Date(),
      returnDate: null,
      delayFee: null,
    };

    const { returnDate, rentDate, delayFee } = postObject;

    const sucessInsert = await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    res.send(error).status(500);
  }
}

async function rentalsReturnMiddleware(req, res, next){
  


}

export {
  rentalsGetMiddleware,
  rentalsPostFinalMiddleware,
  rentalsPostMiddleware,
};
