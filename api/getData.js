import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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

export default async function handler(req, res) {
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
}