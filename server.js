import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
const PORT = 3000;

// Fix für __dirname bei ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

function insertFieldNames(fieldName){
    switch(fieldName){
        case "equality":
            return "Gleichstellung & Inklusion";
        case "europe":
            return "Europa & internationale Begegnung";
        case "future":
            return "Digitalisierung & Medien";
        case "klima":
            return "Klima & nachhaltige Entwicklung";
        case "mental":
            return "Gesundheit & Wohlbefinden";
        case "participation":
            return "Demokratie & Jugendbeteiligung";
        case "school":
            return "Bildung & Lernen";
        case "work":
            return "Arbeit & soziale Sicherheit";
        default: 
            return fieldName;
    }
}

app.post("/api/submit", async (req, res) => {
  const { points } = req.body;
  console.log("Received points:", points);
  //Fetch the points from the request to the database
  for (let key in points) {
    console.log("Updating field:", key, "with points:", points[key]);
    const{ data, fetchError } = await supabase
      .from('result')
      .select('*')
      .eq('field', key)
    if (fetchError) {
      console.error("Error fetching data:", fetchError);
      continue; // Skip to the next key if there's an error
    }
    const { error } = await supabase
      .from('result')
      .update({ result: data[0].result + points[key] })
      .eq('field', key)
    if (error) {
      console.error("Error inserting data:", error);
    }
  }
  res.status(200).json({ message: "Points received successfully" });
})

app.get("/api/getData", async (req, res) => {
  const { data, error } = await supabase
    .from('result')
    .select('*')
    if(error){
      console.error("Error fetching data:", error);
      res.status(500).json({message: "Error fetching data"});
    }
    for(let i = 0; i < data.length; i++){
      data[i].field = insertFieldNames(data[i].field);
    }
    console.log("Debug Result:", data);
    res.status(200).json(data);
})
// Production: React Build serven
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
