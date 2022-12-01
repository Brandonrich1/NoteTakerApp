const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json())
const path = require("path");
const fs = require("fs")
const {randomUUID} = require("crypto")

const readJson = () => {
    const rawData = fs.readFileSync("db/db.json");
    return JSON.parse(rawData)
} 

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
    current.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(current))
    res.json(newNote)
})

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
app.listen(process.env.PORT || 3001)