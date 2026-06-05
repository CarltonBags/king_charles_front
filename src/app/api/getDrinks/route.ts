import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export async function POST (req: Request) {

    const prefilter = await req.json()

    console.log("prefilter in drinks", prefilter)

    const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY
    })

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )

   const parsed = prefilter

    const res = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: parsed.semantic_query.trim()
    })

    if(!res){
        throw new Error("Deepseek did not return a response")
    }

    const embeddingVec = res.data[0].embedding

    console.log('negative being sent:', parsed.negative)
console.log('negative_categories being sent:', parsed.negative)


    const { data, error } = await supabase.rpc(
    'match_drinks',
        {
            query_embedding: embeddingVec,
            
            semantic_query: parsed.semantic_query ?? null,
            drink_type: parsed.drink_type ?? null,
            is_alcoholic: parsed.is_alcoholic ?? null,
            max_abv: parsed.max_abv ?? null,
            negative: parsed.negative?.length ? parsed.negative : null,
            negative_categories: parsed.negative?.length ? parsed.negative : null,
            match_count: 10
            
        }
    )

    if(error){
        console.log("error", error)
        return
    }
    
    console.log("data:", data)

    return Response.json({ result: data })

}