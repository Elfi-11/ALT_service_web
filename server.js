const bodyParser = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;
app.use(bodyParser.json());


//init bdd
const runFromDB = (sql_request) => {
    const db = new sqlite3.Database("db.sqlite");
    const result = db.serialize(() => {
        return db.run(sql_request);
    });
    db.close()
    return result
};


const allFromDB = async (sql_request) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("db.sqlite");
        db.all(sql_request, [], (err, row) => {
            if(err) {
                reject(err)
            } else {
                resolve(row)
            } 
        })
        db.close()
    })
};


runFromDB("CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed TINYINT)");



app.get("/tasks", async (req, res) => {
    const tasks = await allFromDB("SELECT * FROM Task");
    res.send(tasks);
});

app.post('/tasks', (req, res) => {
    const body = req.body
    allFromDB(`INSERT INTO Task (title, completed) VALUES("${body.title}", "0")`);
    res.status(200).send("Task created");
})

app.put('/tasksByID/:id', async (req, res) => {
    const { id } = req.params
    const tasks = await allFromDB(`SELECT * FROM Task WHERE ${id}`);
    const task = tasks[0];
    console.log("TOGGLE COMPLETE ON TASK", task);
    runFromDB(`UPDATE Task
    SET completed = "${task?.completed ? 0 : 1}"
    WHERE id = ${task?.id}`);
    res.status(200).send(`Task update (${task?.completed ? "pas finie" : "finie"})`)
})

app.delete('/tasksDelete/:id', (req, res) => {
    const { id } = req.params
    runFromDB(`DELETE FROM Task WHERE id = ${id} `)
    res.status(200).send("Tâche supprimé")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//crééer point api put pour modifier une task by id