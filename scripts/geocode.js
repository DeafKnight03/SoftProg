// scripts/geocode.js

const fs = require("fs");
const fetch = require("node-fetch");

async function geocodeAddress(address) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    street: address,
    city: "Bologna",
    format: "json",
  });
  // identifica la tua app (evita blocchi)
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "SOScial-App/1.0" }
  });
  const data = await res.json();
  return data[0]
    ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    : null;
}

async function main() {
  const filePath = "./src/data/markers.json";
  const markers = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (let m of markers) {
    console.log(`⏳ Geocoding: ${m.indirizzo}`);
    const coord = await geocodeAddress(m.indirizzo);
    if (coord) {
      m.coord = coord;
      console.log(`✅ ${m.indirizzo} → ${coord.lat},${coord.lng}`);
    } else {
      console.warn(`❌ ${m.indirizzo} non trovata`);
    }
    // rispetta i limiti di Nominatim
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Salva su un nuovo file (o sovrascrivi)
  fs.writeFileSync("./src/data/markers-geocoded.json",
    JSON.stringify(markers, null, 2)
  );
  console.log("🎉 markers-geocoded.json generato!");
}

main().catch(console.error);
