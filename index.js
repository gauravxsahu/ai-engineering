import express from "express";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";



const app = express();

//-------google-genai----------

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// async function main() {
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: "Explain what is LangGraph in simple words",
//     });

//     console.log(response.text);
// }

// main();

// async function main() {
//     const response = await ai.models.generateContentStream({
//         model: "gemini-2.5-flash",
//         contents: "Explain what is LangGraph in simple words",
//     });

//     for await(const chunk of response) {
//         console.log(chunk.text);
//     }
// }

// main();
//------------------------------------------------------

// ------openai

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const response = await client.responses.create({
//     model: "gpt-4o",
//     // instructions: "You are a js developer explane each concept  in simple english and provide code examples.", //System Instructions
//     input:[
//         // roles = system/devlopers,user,assistant
//         {
//             role:"system",
//             content:"You are a js developer explane each concept  in simple english and provide code examples."

//         },
//         {
//             role:"user",
//             content:"Explain imp function use in array in simple words"
//         }
//     ]
    
// })
// console.log(response.output_text);

//....................................................................
//Multi-turn Conversations

// const response = await ai.responses.create({
//     model: "YOUR_MODEL",
//     input: "What is React?"
// });

// const nextResponse = await client.responses.create({
//     model: "YOUR_MODEL",
//     previous_response_id: response.id,
//     input: "Why do we use it?"
// });

// console.log(nextResponse.output_text);
//......................................................................
//streaming Responses

// const responseStream = await client.responses.createStream({
//     model: "YOUR_MODEL",
//     input: "Explain what is LangGraph in simple words"
// });

// for await (const event of responseStream) {
//     if (event.type === "response.output_text.delta") {
//         process.stdout.write(event.delta);
//     }
// }

// Structured Outputs (JSON)

// const responseStructured = await client.responses.create({
//     model: "gpt-4o",
//     input: "my name is gaurav and my age is 21 and i am from kota, please provide me in json format",
//     text:{
//         format:{
//             type:"json_schema",
//             name:"user_details",
//             schema:{
//                 type:"object",
//                 properties:{
//                     name:{type:"string"},
//                     age:{type:"number"},    
//                     city:{type:"string"}
//                 },
//                 required:["name","age","city"],
//                 additionalProperties:false
//             }
//         }
//     }
// });
// console.log(responseStructured.output_text);

// openai TOOL

function get_current_weather(location, unit = "celsius") {
    // Mock implementation of getting current weather
    const weatherData = {
        "San Francisco, CA": { celsius: 15, fahrenheit: 59 },
        "New York, NY": { celsius: 10, fahrenheit: 50 },
        "Los Angeles, CA": { celsius: 20, fahrenheit: 68 }
    };

    const weather = weatherData[location];
    if (!weather) {
        return `Weather data for ${location} is not available.`;
    }

    return unit === "celsius" ? `${weather.celsius}°C` : `${weather.fahrenheit}°F`;
}

const tools=[
    {
        type:"function",
        name:"get_current_weather",
        description:"Get the current weather in a given location",
        parameters:{
            type:"object",
            properties:{
                location:{
                    type:"string",
                    description:"The city and state, e.g. San Francisco, CA"
                },
                unit:{
                    type:"string",
                    enum:["celsius","fahrenheit"]
                }
            },
            required:["location"]
        }   
    }
]
const response = await client.responses.create({
    model:"gpt-4o",
    tools:tools,
    input:"What is the current weather in San Francisco, CA?",

})
console.log(response);




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});