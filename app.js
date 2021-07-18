const express = require("express");
const app = express();

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

app.use(express.json());
let dbConnectionObj = null;

const initializeDBandServer = async () => {
  dbConnectionObj = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("Server started at http://localhost/3000");
  });
};
initializeDBandServer();

//API-1 ---- GET all players
app.get("/players/", async (request, Response) => {
  const getPlayersQuery = `SELECT  
    player_id AS playerId, 
    player_name AS playerName,
    jersey_number AS jerseyNumber, 
    role 
    FROM cricket_team`;
  const playerList = await dbConnectionObj.all(getPlayersQuery);
  Response.send(playerList);
});

//API-2

app.post("/players/", async (request, Response) => {
  const reqBody = request.body;
  const { playerName, jerseyNumber, role } = reqBody;
  const postPlayerQuery = `INSERT INTO 
            cricket_team(
                player_name,
                jersey_number,
                role)
                VALUES(
                    '${playerName}',
                    ${jerseyNumber} ,
                    '${role}' ); `;

  await dbConnectionObj.run(postPlayerQuery);
  Response.send("Player Added to Team");
});

//API-3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerQuery = `SELECT 
    player_id AS playerId, 
    player_name AS playerName,
    jersey_number AS jerseyNumber, 
    role 
    FROM cricket_team
     WHERE 
    player_id = ${playerId} ;`;

  const player = await dbConnectionObj.get(getPlayerQuery);
  response.send(player);
});

//API-4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const reqBody = request.body;
  const { playerName, jerseyNumber, role } = reqBody;
  const updatePlayerQuery = `UPDATE cricket_team 
    SET player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
        WHERE player_id = ${playerId};`;

  await dbConnectionObj.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API-5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team 
    WHERE player_id = ${playerId};`;
  await dbConnectionObj.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
