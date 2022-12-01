//required pkgs
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json())
const path = require("path");
const fs = require("fs")

//random id for each note in the DB
const {randomUUID} = require("crypto")


//write the raw data user imputs into the database
const readJson = () => {
    const rawData = fs.readFileSync("db/db.json");
    return JSON.parse(rawData)
} 
//get
app.get("/api/notes", (req,res) =>{
    res.json(readJson())
});

app.post("/api/notes", (req,res) =>{
    const body = req.body;
    const current= readJson();
    const newNote =  {
        title: body.title,
        text: body.text,
        id: randomUUID()
    }
    //stringify notes to json
    current.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(current))
    res.json(newNote)
})
// delete notes
app.delete("/api/notes/:id", (req,res) => {
    const id = req.params.id
    const current = readJson();
    const result = current.filter(note => note.id != id);
    fs.writeFileSync("db/db.json", JSON.stringify(result))
    res.sendStatus(200);
})

app.get("/notes",(req, res) =>{
res.sendFile(path.join(__dirname, "public/notes.html"));
})



app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname, "public/index.html"))
})
//npm start localhost port
app.listen(process.env.PORT || 3001)