//LangChain is a framework that helps developers build applications powered by Large Language Models (LLMs).
/* 

It provides reusable components to connect:
- LLMs (OpenAI, Gemini, etc.).
- Prompts.
- Documents.
- Vector databases.
- Tools.
- Memory and conversation history.
- Retrievers.
- Agents.

*/
/* 
concept 1 - models 

->openAI
->gemini
->anthropic
->huggingface


Your Application
      |
      v
model.invoke("what is langchain?")
      |
      v
LangChain ChatOpenAI
      |
      v
OpenAI API Request
      |
      v
GPT-4o-mini
      |
      v
Generated Response
      |
      v
LangChain AIMessage
      |
      v
response.content


 */


import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod"
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
const app = express();
const port = 3000;
const model = new ChatOpenAI(
    {
        model: "gpt-4o-mini",
        temperature: 0.7, //Controls the randomness of the model’s output. A higher number makes responses more creative; lower ones make them more deterministic.
        // timeout:30,//The maximum time (in seconds) to wait for a response from the model before canceling the request.
        maxTokens: 1000,//Limits the total number of tokens in the response, effectively controlling how long the output can be.
        maxRetrives: 6//The maximum number of attempts the system will make to resend a request if it fails due to issues like network timeouts or rate limits
    }
);

/* 
invoke()	Generate one response
const response =await model.invoke("top five quote of dream");

console.log("Response from LangChain:", response.content); 
*/


/* 
stream()	Receive response in chunks
const response =await model.stream("top five quote of dream");

for await(const chunk of response){
    console.log(chunk.text)
} 
*/

/* 
batch()	Process multiple inputs
const response = await model.batch(
    [
        "what is frontend",
        "what is backend",
        "what is ai engineering"
    ],
    {
        maxConcurrency:5, // Limit to 5 parallel calls
    }
)   
for(const res of response){
    console.log(res.content)
}
 */

// Concept 2: Prompts and Prompt Templates
/* 
A prompt is an instruction you provide to an AI model.

A reusable prompt containing dynamic variables.

Example:
You are an expert {subject} teacher.

Explain {topic} in simple language.

Here:
- {subject} is dynamic.
- {topic} is dynamic.

User Input
    |
    v
Prompt Template
    |
    v
Dynamic Variables
    |
    v
Final Prompt
    |
    v
LLM
    |
    v
Response


Where is it useful?
Suppose you are building an AI interview application.

You can create different prompt templates:
- Technical interview prompt.
- HR interview prompt.
- DSA interview prompt.
- Resume analysis prompt.
You don't need to write the entire prompt again and again.

 */

/* 
const prompt =ChatPromptTemplate.fromMessages([
    [
        "system",
        "you are an expert {subject} teacher, explain concept simply"
    ],
    [
        "human",
        "expain {topic}"
    ]
])
const message = await prompt.invoke({
    subject:"javaScript",
    topic:"promises"
})

const response = await model.invoke(message);
console.log(response.content)

 */

//Concept 3: Output Parsers
//These are important concepts for an AI Engineer because LLMs generate text, but applications often need structured and predictable data.


//StringOutputParser
/* 
const parser = new StringOutputParser();

const response = await model.invoke("expain js in simple word")
const result = await parser.invoke(response)
console.log(result)
console.log(typeof result) //string

 */

// JsonOutputParser

// const parser = new JsonOutputParser()

// const response = await model.invoke(`You are an AI assistant.

// Return ONLY valid JSON.

// Question: What can someone build using React, Node.js, and MongoDB?

// /* Required JSON format:
// {
//     "message": "string",
//     "skills": ["string"],
//     "projects": ["string"]
// } */

//  ${parser.getFormatInstructions()} -> /* >It provides instructions to the LLM about the expected JSON format.

// This is useful because you don't need to manually write all the JSON formatting instructions yourself. 

//  */
// `)

// const result = await parser.parse(response.content)   //containing object

// console.log(result)

//Structure output 
/* 
const schema = z.object({
    name:z.string(),
    Skills:z.array(z.string()),
    Experience:z.number(),
    role:z.string()
})

const structureModel = model.withStructuredOutput(schema);

const result = await structureModel.invoke(`Rahul is a full stack developer.
He knows React, Node.js and MongoDB.
He has 2 years of experience. `)

console.log(result)
 

// zod validation

const res = schema.safeParse(result)
if(res.success){
console.log(res.data)
}else {
  console.log("Validation error:", result.error.issues);
}
*/

/* 
 StringOutputParser - Get normal text 
 JsonOutputParser - Parse JSON from LLM response 
 Structured Output + Zod - Get structured data matching a schema 
 Zod Validation - Validate data against a schema 

 */


//Concept 4: Chains
/* 
suppose you want to build an application that:
1. Accepts a topic.
2. Creates a prompt.
3. Sends it to an LLM.
4. Converts the response into a string.

You can manually call each component.

But LangChain allows you to connect these components into a pipeline.

This is called a Chain.
 */


/* 
const prompt = ChatPromptTemplate.fromTemplate(
  "Explain {topic} in simple language with examples."
);

const parser = new StringOutputParser();

// Create chain
const chain = prompt
  .pipe(model)
  .pipe(parser);

// Execute chain
const result = await chain.invoke({
  topic: "LangChain"
});

console.log(result);

 */

//Embedding
/* 
Embeddings convert text into numerical vectors.

Similar meanings tend to have similar vector representations

Text
 |
 v
Embedding Model
 |
 v
Numerical Vector
 |
 v
Vector Database

 */
/* 
const embedding  = new OpenAIEmbeddings(
    {
        model:"text-embedding-3-small"
    }
);

const vector = await embedding.embedQuery(
    "java script is a programming language"
)
console.log(vector)

 */
/* 
Vector Databases


Now you have embeddings.

Where will you store them?

You need a Vector Database.

A Vector Database stores vectors and supports similarity searches.

Popular options:
- Pinecone
- Chroma
- Qdrant
- Weaviate
- PostgreSQL with pgvector.
Example
Imagine your PDF contains 1,000 chunks.

You generate embeddings for all 1,000 chunks and store them.
Vector Database

Document 1 -> Embedding 1
Document 2 -> Embedding 2
Document 3 -> Embedding 3
Document 4 -> Embedding 4
...
Document 1000 -> Embedding 1000

When the user asks a question:
1. Convert the question into an embedding.
2. Search for similar vectors.
3. Retrieve relevant documents.
4. Send them to the LLM.

 */


//TOOLS AND TOOL CALLING
/* 
What is a Tool?
A tool is an external function that an AI model can use.

For example:

You are building an AI assistant.

User asks:

"What is the weather in Jaipur?"

An LLM alone does not automatically know the current weather.

You can provide a weather API as a tool.

User
 |
 v
AI Model
 |
 v
Decides to use Weather Tool
 |
 v
Weather API
 |
 v
API Result
 |
 v
AI Model
 |
 v
Final Answer

Tool	-     Responsibility
Weather Tool  -	Get weather
Search Tool -	Search the internet
Calculator	-Perform calculations
Database Tool-	Query database
Email Tool	-Send emails
File Tool -	Read documents


 */

const calculator = tool(
    async ({ a, b }) => {
        return a + b
    },
    {
        name: "calculator",
        description: "add two number",
        schema: z.object({
            a: z.number(),
            b: z.number()
        })

    }
)
// tool() creates a tool.
// First argument is the actual function.
// name identifies the tool.
// description explains when to use it.
// schema defines the expected input.

/*  

// tool function manually clal karna padta hai open ai ki tarah bu createAgent ke sath sab automatic hot a hai

const modelwithtools = model.bindTools([calculator])


       User Question
             |
             v
        AI Model
             |
             v
      Tool Call Request
             |
             v
     Backend Executes Tool
             |
             v
        Tool Result
             |
             v
       AI Model Again
             |
             v
       Final Response
             |
             v
           User
 */

//Agent
/* 
 The user asks:

"Find three AI internships in Jaipur and calculate their average monthly stipend."

The AI needs to:
1. Search for internships.
2. Extract their stipend information.
3. Calculate the average.
4. Present the result.
You don't necessarily want to hardcode every step.

You want the AI to decide which tools to use and in what order.


What is an Agent?
An agent is an AI system that can decide which actions to take using available tools to complete a task.

          User Input
               |
               v
           AI Model
               |
               v
        Decide Next Action
               |
               v
          Select Tool
               |
               v
         Execute Tool
               |
               v
        Receive Result
               |
               v
           AI Model
               |
          Is task complete?
             /      \
           No        Yes
           |          |
           v          v
       Select      Final Answer
       Another
        Tool
*/
const agent = createAgent({
    model,
    tools: [calculator],
    systemPrompt: `you are a helpful mathematical assistant.

    Use the calculator tool when calculations are required`

})

const result=await agent.invoke({
    messages:[
        {
            role:"user",
            content:" 500+700"
        }
    ]
})
console.log(result)

 














app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});