const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;


//init bdd
const runFromDB = (sql_request) => {
    const db = new sqlite3.Database("db.sqlite");
    const result = db.serialize(() => {
        return db.run(sql_request);
    });
    db.close()
    return result
};


runFromDB("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT)");


app.get("/", (req, res) => {
    const tasks = runFromDB("SELECT * FROM Task");
    res.send(tasks);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});