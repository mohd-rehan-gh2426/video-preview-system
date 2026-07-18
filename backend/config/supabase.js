import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing in .env");
}

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
