import express from "express";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { Moderations } from "openai/resources";



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

// openai TOOL-----------------------------------------------------------***

// function get_current_weather(location, unit = "celsius") {
//     // Mock implementation of getting current weather
//     const weatherData = {
//         "San Francisco, CA": { celsius: 15, fahrenheit: 59 },
//         "New York, NY": { celsius: 10, fahrenheit: 50 },
//         "Los Angeles, CA": { celsius: 20, fahrenheit: 68 }
//     };

//     const weather = weatherData[location];
//     if (!weather) {
//         return `Weather data for ${location} is not available.`;
//     }

//     return unit === "celsius" ? `${weather.celsius}°C` : `${weather.fahrenheit}°F`;
// }

// const tools=[
//     {
//         type:"function",
//         name:"get_current_weather",
//         description:"Get the current weather in a given location",
//         parameters:{
//             type:"object",
//             properties:{
//                 location:{
//                     type:"string",
//                     description:"The city and state, e.g. San Francisco, CA"
//                 },
//                 unit:{
//                     type:"string",
//                     enum:["celsius","fahrenheit"]
//                 }
//             },
//             required:["location"]
//         }   
//     }
// ]
// const response = await client.responses.create({
//     model:"gpt-4o",
//     tools:tools,
//     input:"What is the current weather in San Francisco, CA?",

// })

// const tool_call = response.output.find((item) => item.type === "function_call");
// let result;

// if(tool_call){
//     console.log(tool_call);
//     const args= JSON.parse(tool_call.arguments);
//     result=  get_current_weather(args.location,args.unit);
//     console.log(result);
// }

// const finalResponse = await client.responses.create({
//     model:"gpt-4o",
//     tools:tools,
//     input:[
//         {
//             role:"user",
//             content:"What is the current weather in San Francisco, CA?"  //User ne ye question poocha tha.
//         },
//         {
//             type: "function_call",
//             name: tool_call.name,
//             arguments: tool_call.arguments,
//             call_id: tool_call.call_id //OpenAI ko batana ki assistant ne kaunsa tool call kiya tha.


//         },
//         {
//             type: "function_call_output",
//             call_id: tool_call.call_id,
//             output: result  //Tumhare JavaScript backend ne function execute kiya aur result mil gaya.
//         }]
// });
// console.log(finalResponse.output_text);

// //--------------------------------------------------------------
// //agar multiple tool call hote hai to 

//     //          USER
//     //            |
//     //            v
//     //          OPENAI
//     //            |
//     //     LLM selects 3 tools
//     //            |
//     //            v
//     //      response.output
//     //            |
//     //            v
//     //       .filter()
//     //            |
//     //    All tool calls found
//     //            |
//     //            v
//     //       FOR LOOP
//     //            |
//     //    +-------+-------+
//     //    |       |       |
//     //    v       v       v
//     //  Weather Calculator UserInfo
//     //    |       |       |
//     //    v       v       v
//     //  15°C     200    Gaurav
//     //    |       |       |
//     //    +-------+-------+
//     //            |
//     //            v
//     //      Tool Results
//     //            |
//     //            v
//     //         OPENAI
//     //            |
//     //            v
//     //      Final Answer



//     const availableFunctions = {
//     get_current_weather: ({ location, unit }) =>
//         get_current_weather(location, unit),

//     calculate: ({ a, b }) =>
//         calculate(a, b),

//     get_user_info: ({ userId }) =>
//         get_user_info(userId)
// };



// //output of first api call (response.output) will be like this:
// // response.output = [
// //     {
// //         type: "function_call",
// //         name: "get_current_weather",
// //         arguments: '{"location":"San Francisco","unit":"celsius"}',
// //         call_id: "call_1"
// //     },
// //     {
// //         type: "function_call",
// //         name: "calculate",
// //         arguments: '{"a":10,"b":20}',
// //         call_id: "call_2"
// //     },
// //     {
// //         type: "function_call",
// //         name: "get_user_info",
// //         arguments: '{"userId":101}',
// //         call_id: "call_3"
// //     }
// // ];


// const tool_calls = response.output.filter(
//     (item) => item.type === "function_call"
// );

// const results = [];

// for (const tool_call of tool_calls) {

//     const args = JSON.parse(tool_call.arguments);

//     const selectedFunction = availableFunctions[tool_call.name];

//     const result = await selectedFunction(...Object.values(args));

//     results.push({
//         type: "function_call_output",
//         call_id: tool_call.call_id,
//         output: String(result)
//     });

// }

// const finalResponse = await client.responses.create({

//     model: "gpt-4o",

//     input: [
//         {
//             role: "user",
//             content: "Tell me the weather in San Francisco, calculate 10 * 20 and get user 101 details."
//         },

//         ...tool_calls,

//         ...results
//     ]

// });

// console.log(finalResponse.output_text);

// -----------------------------------------------------


//IMAGE UNDERSTANDING   

// const response = await ai.responses.create({
//     model: "YOUR_VISION_CAPABLE_MODEL",

//     input: [{
//         role: "user",
//         content: [
//             {
//                 type: "input_text",
//                 text: "Describe this image."
//             },
//             {
//                 type: "input_image",
//                 image_url: "https://example.com/image.jpg"
//             }
//         ]
//     }]
// });

// console.log(response.output_text);


//IMAGE GENERATION

// const response = await client.images.generate({
//     model: "gpt-image-1.5",
//     prompt: "A futuristic cityscape at sunset, with flying cars and neon lights.",
//     size: "1024x1024"
// });

// const image=response.data[0].b64_json;
// const imageBuffer=Buffer.from(image,"base64");
// fs.writeFileSync("futuristic_cityscape.png",imageBuffer);
// console.log("Image generated and saved as futuristic_cityscape.png");

//image = Base64 string.
// "base64" = Encoding format.
// Buffer.from() = Base64 ko binary data mein convert karta hai.

// -----------------------------------------------------------
// next concept of open ai in voice.js{open ai audio api concept}
//------------------------------------------------------------------

//Embeddings
//Text ko numerical vector representation mein convert karna.
/* const response =await client.embeddings.create({
    model:"text-embedding-3-large",
    input:"Hello, how are you?"
});
console.log(response.data[0].embedding.length); //vector length print karega




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
 */

// Use cases:
// - Semantic search
// - RAG
// - Recommendation systems
// - Similarity search

// -----------------------------------------------------

//Web Search in OpenAI API
/* 
Web Search is a built-in tool in OpenAI that allows an AI model to search the internet and retrieve up-to-date information while generating a response.

Normally, an LLM answers using the knowledge it learned during training. Its knowledge may be outdated.

But with Web Search, the model can retrieve fresh information from the internet and use it to answer the user's question. 

*/
/* 
User:
"What are the latest AI developments?"    ---->input

          |
          v
     OpenAI Model
          |
          v
   Decides to use Web Search
          |
          v
     Web Search Tool
          |
          v
   Searches the Internet
          |
          v
   Gets Search Results
          |
          v
  Results automatically
  returned to the model
          |
          v
    Model understands
    and analyzes results
          |
          v
      Final Answer
 */


/*
 const response = await client.responses.create({
    model: "gpt-4o",
    tools: [
        {
            type: "web_search"
        }
    ],
    input: "What is the latest news about AI?"
});

console.log(response.output_text);
*/

// --------------------------------------------------------

//moderation

// Moderation is a safety mechanism in OpenAI that helps detect harmful,
//  unsafe, or inappropriate content in text and images

// Moderation can identify categories such as:
// - Hate
// - Harassment
// - Self-harm
// - Sexual content
// - Violence
// - Illicit activities

/*
 const response = await client.moderations.create({

    model: "omni-moderation-latest",

    input: "I want to hurt someone."
});

const moderationResult = response.results[0];

if (moderationResult.flagged) {
    console.log("Content is flagged for moderation.");
    console.log("Categories:", moderationResult.categories);
} else {
    console.log("Content is safe.");
}
 */

// custom Moderations system
 
/*
 ex-->

function checkContent(input) {
    const blockedWords = ["example1", "example2"];

    const isBlocked = blockedWords.some(word =>
        input.toLowerCase().includes(word)
    );

    return !isBlocked;
}
 */