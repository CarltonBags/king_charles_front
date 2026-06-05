"use client"

export async function submitPrefilter (userInput: string) {

    const response = await fetch("/api/prefilter",{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userInput
        })

    })

    return Response.json(
    { error: "Invalid userInput" },
    { status: 400 }
  );
}