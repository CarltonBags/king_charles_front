import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("quiz")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Shuffle and pick 10
  const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 10);

  return Response.json({ questions: shuffled });
}
