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

    if (!response.ok) {
        throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("data query", data)

    return data.result;

}

export async function getDrinks (prefilter: string) {

    const response = await fetch("/api/getDrinks",{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(prefilter)

    })

    if (!response.ok) {
        throw new Error("API request failed");
    }

    const data = await response.json();

    return data.result;

}