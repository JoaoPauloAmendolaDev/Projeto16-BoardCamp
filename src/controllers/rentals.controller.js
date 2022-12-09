import connection from "../server.js";

async function rentalsGetController(req, res) {
  res.send(res.locals.filtered).status(200);
}

async function rentalsReturnController(req, res){

    let {game} = res.locals.game
    


}

export { rentalsGetController };
