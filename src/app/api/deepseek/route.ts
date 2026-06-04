import { preFilterSystemPrompt } from "./prompts"
import OpenAI from "openai"

export async function POST (req: Request) {

    let systemPrompt: string
        const {type, userInput} = await req.json()

    switch (type) {
        case "prefilter":
            systemPrompt = preFilterSystemPrompt
        break

        default:
            throw new Error(`Unknown type: ${type}`)
    }

    const openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_KEY
    })

    const response = await openai.chat.completions.create({
        model: "deepseek-v4-flash",
        messages:[
            {role: "system", content: systemPrompt},
            {role: "user", content: userInput}
        ],
        response_format:{
            "type": "json_object"
        }

    })


       


}














