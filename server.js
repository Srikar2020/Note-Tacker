const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return note;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

function deleteNote(id, notesArray){
    const result = findById(id,notesArray);
    for(let i = 0; i < notesArray.length; i ++){
        if(notesArray[i].id === id){
            notesArray.splice(i,1);
            break;
        }
    }

    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );

    return result;
}

app.get('/api/notes', (req, res) => {
    let results = notes;

    res.json(results);
});

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = uniqid();

    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.delete('/api/notes/:id', (req,res) => {
    const note = deleteNote(req.params.id, notes);

    res.json(note);
})

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


