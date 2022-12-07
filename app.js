const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
    *
    FROM
    cricket_team;
    `;
  const playerDetails = await db.all(getPlayersQuery);
  response.send(playerDetails);
});

app.post("/players/", async (request, response) => {
  const newPlayer = request.body;
  const { playerName, jerseyNumber, role } = newPlayer;
  const addPlayerQuery = `INSERT INTO
    cricket_team(player_name,jersey_number,role)
    VALUES
    (
        "${playerName}",
         ${jerseyNumber},
        "${role}"
    );`;
  const addDBResponse = await db.run(addPlayerQuery);
  response.send("Player Addedd to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
         *
    FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;
  const getDBResponse = await db.get(getPlayerQuery);
  response.send(getDBResponse);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updateDetails = request.body;
  const { playerName, jerseyNumber, role } = updateDetails;
  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET
        player_name='${playerName}',
        jersey_number=${jerseyNumber},
        role='${role}'
    WHERE 
        player_id=${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
         cricket_team
    WHERE
        player_id = ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});

module.exports = app;
