const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

// Percorsi file
const segnalazioniPath = path.join(__dirname, 'src/data/segnalazioni.json');
const eventiPath = path.join(__dirname, 'src/data/markers.json');
const geocodeScriptPath = path.join(__dirname, 'scripts/geocode.js');

app.use(cors());
app.use(express.json());

/**
 * 🔁 Approva una segnalazione di tipo "aggiunta"
 */
app.post('/api/approva/:id', (req, res) => {
  const id = req.params.id;
  let segnalazioni = JSON.parse(fs.readFileSync(segnalazioniPath));
  let eventi = fs.existsSync(eventiPath) ? JSON.parse(fs.readFileSync(eventiPath)) : [];

  const index = segnalazioni.findIndex(s => String(s.idSignal) === id && s.tipoSegnalazione === 'aggiunta');
  if (index === -1) return res.status(404).json({ error: 'Segnalazione non trovata o non è una "aggiunta"' });

  const segnalazione = segnalazioni.splice(index, 1)[0];

  const newId = eventi.length > 0 ? Math.max(...eventi.map(e => e.id)) + 1 : 1;
  const nuovoEvento = {
    id: newId,
    type: segnalazione.type,
    gravita: segnalazione.gravita,
    descrizione: segnalazione.descrizione,
    data: segnalazione.data,
    ora: segnalazione.ora,
    indirizzo: segnalazione.indirizzo,
    coord: segnalazione.coord || null
  };

  eventi.push(nuovoEvento);

  fs.writeFileSync(segnalazioniPath, JSON.stringify(segnalazioni, null, 2));
  fs.writeFileSync(eventiPath, JSON.stringify(eventi, null, 2));

  // Avvia geocoding
  exec(`node ${geocodeScriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Geocoding fallito:", stderr);
    } else {
      console.log("✅ Geocoding completato:\n" + stdout);
    }
  });

  res.json({ success: true, evento: nuovoEvento });
});

/**
 * ❌ Rimuove un evento (tipo segnalazione: "rimozione") e cancella la segnalazione
 */
app.delete('/api/eventi/:id', (req, res) => {
  const id = req.params.id;
  let eventi = JSON.parse(fs.readFileSync(eventiPath));
  let segnalazioni = JSON.parse(fs.readFileSync(segnalazioniPath));

  const eventoIndex = eventi.findIndex(e => String(e.id) === id);
  if (eventoIndex === -1) return res.status(404).json({ error: 'Evento non trovato' });

  eventi.splice(eventoIndex, 1);

  // Rimuovi la segnalazione "rimozione" con idEvento corrispondente
  segnalazioni = segnalazioni.filter(s => !(s.tipoSegnalazione === 'rimozione' && String(s.idEvento) === id));

  fs.writeFileSync(eventiPath, JSON.stringify(eventi, null, 2));
  fs.writeFileSync(segnalazioniPath, JSON.stringify(segnalazioni, null, 2));

  // Avvia geocoding
  exec(`node ${geocodeScriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Geocoding fallito:", stderr);
    } else {
      console.log("✅ Geocoding completato:\n" + stdout);
    }
  });

  res.json({ success: true });
});

/**
 * ❌ Rifiuta una segnalazione (qualsiasi tipo)
 */
app.delete('/api/segnalazioni/:id', (req, res) => {
  const id = req.params.id;
  const segnalazioni = JSON.parse(fs.readFileSync(segnalazioniPath));
  const updated = segnalazioni.filter(s => String(s.idSignal) !== id);

  fs.writeFileSync(segnalazioniPath, JSON.stringify(updated, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});


app.post('/api/segnalazioni', (req, res) => {
  const nuovaSegnalazione = req.body;

  if (!nuovaSegnalazione || !nuovaSegnalazione.tipoSegnalazione || !nuovaSegnalazione.idSignal) {
    return res.status(400).json({ error: 'Dati mancanti o non validi' });
  }

  const segnalazioni = fs.existsSync(segnalazioniPath)
    ? JSON.parse(fs.readFileSync(segnalazioniPath))
    : [];

  segnalazioni.push(nuovaSegnalazione);

  fs.writeFileSync(segnalazioniPath, JSON.stringify(segnalazioni, null, 2));
  console.log(`📌 Aggiunta nuova segnalazione ${nuovaSegnalazione.tipoSegnalazione} con ID ${nuovaSegnalazione.idSignal}`);

  res.json({ success: true });
});
