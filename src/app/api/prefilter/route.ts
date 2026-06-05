import OpenAI from "openai"
import { preFilterSystemPrompt } from "./prompt"

export async function POST (req: Request) {

    const {userInput} = await req.json()
    if(!userInput || typeof userInput !== "string"){
        return Response.json(
            { error: "Invalid userInput" },
            { status: 400 }
        );
    }

    const openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_KEY
    })

    try{
        const response = await openai.chat.completions.create({
            model: "deepseek-v4-flash",
            messages:[
                {role: "system", content: preFilterSystemPrompt},
                {role: "user", content: userInput}
            ],
            response_format:{
                "type": "json_object"
            }

        })

        if(!response){
            throw new Error("Deepseek returned no response")
        }

        let parsed

        try{
            parsed = JSON.parse(response.choices[0].message.content!)
        }catch{
            throw new Error(`Deepseek returned malformed JSON: ${response.choices[0].message.content}`)
        }

        console.log("response:",response.choices[0].message.content)
        return Response.json({result: JSON.parse(response.choices[0].message.content ?? "{}")})

    }catch(error){
        console.log("Deepseek API call failed:", error)
        return Response.json(
            {error:`Deepseek API-call failed:${error}`},
            {status: 500}
        )
    }
    
       
}














