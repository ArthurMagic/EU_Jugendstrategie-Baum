import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { points } = req.body;
  console.log("Received points:", points);
  //Fetch the points from the request to the database
  for (let key in points) {
    console.log("Updating field:", key, "with points:", points[key]);
    const { data, fetchError } = await supabase
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
}