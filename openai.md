# OpenAI API with JavaScript — Complete Learning Notes (Concepts 1–20)

> A practical reference for learning the 20 OpenAI API concepts using JavaScript and Node.js.
>
> **How to use this README:** Read the meaning first, understand the simple example, then try the code. Do not try to memorize all 20 at once. Concepts 1–10 cover the basic interaction and tool workflow; concepts 11–20 add images, audio, retrieval, safety, and evaluation.

---

## Table of Contents

1. [Basic API Integration](#1-basic-api-integration)
2. [Text Generation](#2-text-generation)
3. [System Instructions](#3-system-instructions)
4. [User and Assistant Messages](#4-user-and-assistant-messages)
5. [Multi-turn Conversations](#5-multi-turn-conversations)
6. [Conversation History](#6-conversation-history)
7. [Streaming](#7-streaming)
8. [Structured Outputs (JSON)](#8-structured-outputs-json)
9. [Function Calling](#9-function-calling)
10. [Tool Calling](#10-tool-calling)
11. [Vision (Image Understanding)](#11-vision-image-understanding)
12. [Image Generation](#12-image-generation)
13. [Audio API](#13-audio-api)
14. [Embeddings](#14-embeddings)
15. [File Search](#15-file-search)
16. [Web Search](#16-web-search)
17. [Code Interpreter](#17-code-interpreter)
18. [Realtime API](#18-realtime-api)
19. [Moderation](#19-moderation)
20. [Evals](#20-evals)

---

## Before You Start

### Requirements

- Node.js installed.
- Basic JavaScript knowledge: variables, functions, arrays, objects, `async/await`, and `try/catch`.
- An OpenAI API key.
- A project folder in which you can run JavaScript files.

### 1. Create a project

```bash
mkdir openai-learning
cd openai-learning
npm init -y
npm install openai dotenv
```

If you use `import` syntax, add this to `package.json`:

```json
{
  "type": "module"
}
```

### 2. Create `.env`

```env
OPENAI_API_KEY=your_api_key_here
```

Keep the API key private. Do not put it in frontend/browser code, GitHub, screenshots, or a public repository. Add `.env` to `.gitignore`:

```gitignore
.env
node_modules
```

### 3. Create `index.js`

```js
import OpenAI from "openai";
import "dotenv/config";

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Put your chosen, API-accessible model name here.
const MODEL = "YOUR_MODEL";
```

The examples below assume that `ai` and `MODEL` have been created as above. Replace `YOUR_MODEL` with a model that supports the feature being demonstrated. Not every model supports every capability.

### A useful mental model

Your JavaScript program sends a request to the OpenAI API. The API returns a response. Your code decides what to do with that response.

```text
Your JavaScript code
       |
       | request (input + settings)
       v
   OpenAI API
       |
       | generated response / events / tool request
       v
Your JavaScript code handles the result
```

The model generates or interprets information. Your application still controls its own database, business rules, permissions, and actions.

---

# 1. Basic API Integration

## Meaning

Basic API integration means connecting your JavaScript application to an OpenAI model through the OpenAI API.

An **API** is a way for two software systems to communicate. In this case, your Node.js program sends input to OpenAI and receives an AI-generated response.

## Example

```js
const response = await ai.responses.create({
  model: MODEL,
  input: "Hello! Introduce yourself in one sentence.",
});

console.log(response.output_text);
```

## Understand each part

- `ai`: the OpenAI client you created.
- `responses.create()`: sends a request to the Responses API.
- `model`: identifies which model should process the request.
- `input`: the content or question you are sending.
- `response`: the object returned by the API.
- `response.output_text`: a convenient way to read the generated text.

## Request and response flow

```text
JavaScript sends input
        |
        v
OpenAI processes the request
        |
        v
OpenAI returns a response object
        |
        v
Your code reads response.output_text
```

## Why is it used?

It allows your JavaScript programs to use AI capabilities such as text generation, reasoning, image understanding, and tool use.

**Remember:** API integration is the connection itself. Text generation, vision, embeddings, and other features are capabilities you can use after making that connection.

---

# 2. Text Generation

## Meaning

Text generation means asking an AI model to create text based on the input you provide.

The output might be an explanation, summary, answer, email, story, or code.

## Example

```js
const response = await ai.responses.create({
  model: MODEL,
  input: "Explain JavaScript Promises with a simple example.",
});

console.log(response.output_text);
```

## What happens?

1. Your program sends the prompt.
2. The model interprets the prompt.
3. The model generates a response.
4. Your code reads and displays the text.

For example, if the input is:

```text
Explain JavaScript Promises with a simple example.
```

The model may return an explanation of pending, fulfilled, and rejected states, along with a code example.

## Common use cases

- Question answering
- Explaining technical concepts
- Summarizing long text
- Generating content
- Drafting emails
- Generating or explaining code

## Important point

Text generation does not automatically mean the answer is correct. Your application should validate important information, especially when the output affects users, money, or important decisions.

---

# 3. System Instructions

## Meaning

System/developer instructions tell the model how it should behave while responding. They set the role, style, boundaries, and rules for the task.

Think of them as the behaviour guidelines for the AI.

## Example

```js
const response = await ai.responses.create({
  model: MODEL,

  instructions: `
    You are a JavaScript teacher.
    Explain concepts in simple English.
    Use a small code example.
    If the learner is a beginner, explain difficult words.
  `,

  input: "What is a closure?",
});

console.log(response.output_text);
```

## Understand the example

The `instructions` field tells the model how to answer. The `input` field contains the actual user question.

- Instruction: “You are a JavaScript teacher.”
- Instruction: “Explain concepts in simple English.”
- User input: “What is a closure?”

The model should answer the question while following the instructions.

## Use cases

- AI tutor
- Customer-support assistant
- Coding assistant
- Interview-preparation assistant
- Writing assistant

## Important point

Instructions guide the model; they are not a replacement for application-side security. For example, do not rely on a prompt alone to authorize a payment or protect private data.

---

# 4. User and Assistant Messages

## Meaning

A conversation can contain messages with different roles. The role tells the model who is speaking or what kind of instruction is being provided.

Common roles and instruction types:

| Role / type | Meaning |
|---|---|
| `developer` / instructions | Application-level behaviour and rules |
| `user` | The user's message |
| `assistant` | The model's response |

In the Responses API, developer guidance can be supplied using `instructions`. Conversation items can also be supplied through `input`.

## Example: a user message

```js
const response = await ai.responses.create({
  model: MODEL,
  input: [
    {
      role: "user",
      content: "What is Node.js?",
    },
  ],
});

console.log(response.output_text);
```

## Understand it

The `role: "user"` field identifies the message as coming from the user. The model responds as the assistant.

A simple conversation looks like this:

```text
User: What is Node.js?
Assistant: Node.js is a JavaScript runtime.
```

## Why are roles useful?

They help separate application instructions from user questions and assistant responses. This distinction becomes especially important when you build a chatbot that has multiple messages.

---

# 5. Multi-turn Conversations

## Meaning

A multi-turn conversation is a conversation containing multiple connected exchanges between the user and the assistant.

A **turn** is one step in the conversation. The user asks something, the assistant responds, and the user can ask a follow-up.

## Example conversation

```text
User: What is React?
Assistant: React is a JavaScript library for building user interfaces.

User: Why do we use it?
Assistant: It helps build reusable and interactive UI components.

User: Give me an example.
Assistant: Here is a simple React component...
```

The second question depends on the context of the first question. The user does not need to repeat “React” every time if the conversation context is maintained.

## JavaScript example using `previous_response_id`

```js
const firstResponse = await ai.responses.create({
  model: MODEL,
  input: "What is React?",
});

console.log("Assistant:", firstResponse.output_text);

const secondResponse = await ai.responses.create({
  model: MODEL,
  previous_response_id: firstResponse.id,
  input: "Why do we use it?",
});

console.log("Assistant:", secondResponse.output_text);
```

## What does `previous_response_id` do?

It references an earlier response so the next request can continue from that response's context.

```text
First request
     |
     v
First response (has an ID)
     |
     | previous_response_id
     v
Second request
     |
     v
Follow-up response
```

## Remember

Multi-turn conversation describes the interaction pattern: multiple connected question-and-answer turns. It does not, by itself, mean that your application has permanently saved the conversation.

---

# 6. Conversation History

## Meaning

Conversation history is the record of earlier messages in a conversation. Your application can keep this history and send the relevant messages with a later request.

Think of it as the conversation's notebook.

## Example

```js
const history = [
  {
    role: "user",
    content: "What is JavaScript?",
  },
  {
    role: "assistant",
    content: "JavaScript is a programming language used to build interactive applications.",
  },
  {
    role: "user",
    content: "Where is it used?",
  },
];

const response = await ai.responses.create({
  model: MODEL,
  input: history,
});

console.log(response.output_text);
```

## What is happening?

The model receives the earlier messages along with the latest question. It can use the supplied context to produce a more relevant answer.

## Multi-turn vs conversation history

| Multi-turn conversation | Conversation history |
|---|---|
| Describes multiple connected exchanges. | The stored record of those exchanges. |
| Describes how the conversation proceeds. | Describes what previous messages are available. |
| Example: user asks a follow-up. | Example: your app stores earlier user and assistant messages. |

## Where can history be stored?

Your application may keep conversation history in memory while a script is running, or persist it in a database when it needs to survive restarts.

**Important:** Decide what history to send. Very long histories can increase cost and may exceed a model's context limit. Applications often keep only relevant recent messages or summarize older ones.

---

# 7. Streaming

## Meaning

Streaming means receiving the model's response in pieces as it is generated, rather than waiting for the entire response to finish.

Without streaming, the user may wait until the complete answer is ready. With streaming, the application can display each text piece as it arrives.

## Without streaming

```text
User asks a question
        |
        v
Wait for the complete response
        |
        v
Display the answer
```

## With streaming

```text
User asks a question
        |
        v
Model starts generating
        |
        v
Text piece 1 arrives -> display it
        |
        v
Text piece 2 arrives -> display it
        |
        v
Text piece 3 arrives -> display it
        |
        v
More pieces arrive until completion
```

## JavaScript example

```js
const stream = await ai.responses.create({
  model: MODEL,
  input: "Explain artificial intelligence in simple English.",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);
  }
}
```

## Understand the important lines

- `stream: true`: asks the API to stream events.
- `for await...of`: reads the incoming events asynchronously, one at a time.
- `event.type`: tells you what kind of event arrived.
- `response.output_text.delta`: indicates a new piece of generated text.
- `event.delta`: contains that text piece.
- `process.stdout.write()`: prints the piece without automatically adding a new line.

## Use cases

- Chat interfaces that show text as it is generated
- Live AI writing assistants
- Applications where showing early output improves responsiveness

## Remember

A stream contains different event types, not just text. This example deliberately handles text-delta events only.

---

# 8. Structured Outputs (JSON)

## Meaning

Structured Outputs let you ask the model to return data in a defined structure, such as a JSON object that follows a JSON Schema.

This is useful when your JavaScript code needs to read individual fields rather than interpret a paragraph.

## Example problem

Input:

```text
Extract the name, age, and skills:
"My name is Gaurav. I am 21 years old. My skills are JavaScript, React, and Node.js."
```

Expected structure:

```json
{
  "name": "Gaurav",
  "age": 21,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

## JavaScript example

```js
const response = await ai.responses.create({
  model: MODEL,
  input: `
    Extract the details from this text:
    Gaurav is 21 years old and knows JavaScript and React.
  `,
  text: {
    format: {
      type: "json_schema",
      name: "user_details",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          skills: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "age", "skills"],
        additionalProperties: false,
      },
    },
  },
});

const userDetails = JSON.parse(response.output_text);
console.log(userDetails.name);
console.log(userDetails.skills);
```

## Understand the schema

- `type: "object"`: the output must be an object.
- `properties`: defines the allowed fields and their data types.
- `required`: lists fields that must be present.
- `additionalProperties: false`: disallows extra fields.
- `strict: true`: asks the model to follow the schema strictly, subject to the API's supported schema rules.

## Why is this useful?

Without a defined structure, the model might answer in different formats. A schema makes the output easier for your program to process.

## Use cases

- Resume parsing
- Extracting information from documents
- Classification
- Converting unstructured text into structured data
- Producing predictable application data

**Remember:** Structured output controls the shape of the response. It does not guarantee that every extracted value is factually correct. Validate important values in your application.

---

# 9. Function Calling

## Meaning

Function calling allows the model to request that your application run one of your custom functions.

The model does **not** directly execute your local JavaScript function. It returns a function-call request with arguments. Your JavaScript code checks the request, runs the function, and can send the result back to the model.

## Example situation

User asks:

```text
What is 25 multiplied by 10?
```

You have a JavaScript function:

```js
function multiply(a, b) {
  return a * b;
}
```

The model can decide that it needs the `multiply` function and request it with `a = 25` and `b = 10`.

## Step 1: Define the function tool

```js
const tools = [
  {
    type: "function",
    name: "multiply",
    description: "Multiply two numbers.",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" },
      },
      required: ["a", "b"],
      additionalProperties: false,
    },
    strict: true,
  },
];
```

This definition tells the model:
- The function's name is `multiply`.
- What the function does.
- Which arguments it needs.
- The expected type of each argument.

## Step 2: Send the request with the tool definition

```js
const response = await ai.responses.create({
  model: MODEL,
  tools,
  input: "What is 25 multiplied by 10?",
});

console.log(response.output);
```

The model may return a function-call item. Your program must inspect the response, find the function call, and execute the matching local function.

## Step 3: Execute the requested function in JavaScript

A simplified handler looks like this:

```js
function multiply(a, b) {
  return a * b;
}

for (const item of response.output) {
  if (item.type === "function_call" && item.name === "multiply") {
    const args = JSON.parse(item.arguments);

    const result = multiply(args.a, args.b);

    console.log("Function result:", result);
  }
}
```

This demonstrates the key idea: **the model requests; your code executes**.

A complete function-calling flow normally sends the function result back to the model as a `function_call_output`, so the model can produce a natural-language answer. See the API documentation when implementing the full round trip.

## Function-calling flow

```text
User asks a question
        |
        v
Model decides a function is needed
        |
        v
Model returns function name + arguments
        |
        v
Your JavaScript validates and runs the function
        |
        v
Your code sends the result back to the model
        |
        v
Model produces the final response
```

## Use cases

- Calculator functions
- Checking an order
- Looking up information in your database
- Getting weather data from an external API
- Calling an application-specific operation

## Important safety point

Never blindly execute every requested function. Check the function name, validate arguments, enforce permissions, and require user confirmation for sensitive actions such as payments or deleting data.

---

# 10. Tool Calling

## Meaning

Tool calling is the broader process of allowing a model to use tools to get information or perform a task.

A tool might be:
- A built-in capability provided by the API, such as web search.
- A custom function that you define and execute in your application.

## Example: built-in web search tool

```js
const response = await ai.responses.create({
  model: MODEL,
  tools: [
    {
      type: "web_search",
    },
  ],
  input: "Find recent developments in JavaScript.",
});

console.log(response.output_text);
```

Here, the model can use the web search tool to help answer the question. Tool availability depends on the model and API configuration.

## Function calling vs tool calling

| Function calling | Tool calling |
|---|---|
| A way to expose your own functions to the model. | The broader tool-use capability. |
| Your application executes the custom function. | A tool may be built in or custom. |
| Example: `multiply(25, 10)`. | Example: web search, file search, or a custom database function. |

## Remember

Function calling is one kind of tool use. Tool calling is the wider concept.

---

# 11. Vision (Image Understanding)

## Meaning

Vision means giving an image to a model and asking it to understand or analyse the image.

The model can answer questions about visible content. For example, you can provide a screenshot and ask what error message appears in it.

## Example

Question:

```text
Describe this image.
```

JavaScript example using an image URL:

```js
const response = await ai.responses.create({
  model: MODEL, // Use a model that supports image input.
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Describe this image.",
        },
        {
          type: "input_image",
          image_url: "https://example.com/image.jpg",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

Replace the example URL with an image that the API can access.

## What can the model do?

For example, you can ask it to:
- Describe objects in a picture.
- Read or explain visible text.
- Interpret a screenshot.
- Answer questions about a diagram.
- Compare visible elements.

## Use cases

- Image analysis
- Screenshot understanding
- Document and diagram understanding
- Visual question answering
- Helping users understand images

## Vision vs image generation

- **Vision:** provide an existing image and ask the model to understand it.
- **Image generation:** provide a prompt and ask the model to create a new image.

---

# 12. Image Generation

## Meaning

Image generation means creating a new image from a text prompt. Some image-generation models also support editing or transforming an existing image.

## Example

```js
const result = await ai.images.generate({
  model: "gpt-image-1.5",
  prompt: "A futuristic city at night, cinematic lighting, wide view.",
});

console.log(result.data);
```

The exact model name, returned image format, and supported parameters can vary. Check the current image-generation documentation for the model you use.

## What is a prompt?

A prompt is the instruction describing the image you want.

A vague prompt:

```text
A city
```

A more descriptive prompt:

```text
A futuristic city at night, tall glass buildings,
neon lights, rainy streets, cinematic wide-angle view.
```

More specific descriptions can help communicate the intended subject and style.

## Use cases

- Concept art
- Marketing graphics
- Product visuals
- Illustrations
- Creative design exploration

## Remember

Vision analyses an image you provide. Image generation creates an image from your instructions.

---

# 13. Audio API

## Meaning

The Audio API provides ways to work with spoken language and audio. It can convert speech to text, generate speech from text, and support audio-based experiences.

## Important operations

| Operation | Meaning | Example |
|---|---|---|
| Speech-to-text | Convert spoken audio into text. | Transcribe a recorded question. |
| Text-to-speech | Convert text into generated speech. | Read an AI answer aloud. |
| Transcription | Produce written text from an audio recording. | Convert a meeting recording into text. |
| Audio understanding | Process audio input for an audio-related task. | Understand a spoken request. |
| Speech generation | Generate an audio response. | Make a voice assistant speak. |

## Example workflow

Imagine you are building a voice-based interview practice application.

```text
User speaks:
"Explain JavaScript closures."
        |
        v
Audio is sent for transcription / audio processing
        |
        v
The application gets or processes the user's request
        |
        v
The model generates an answer
        |
        v
Text-to-speech generates spoken output
        |
        v
User hears the answer
```

## Use cases

- Voice assistants
- AI interviewers
- Voice chatbots
- Audio transcription
- Spoken learning applications

## Remember

Audio is not just one operation. Speech input, transcription, and speech output are different parts of an audio application. The endpoint and model depend on the task.

---

# 14. Embeddings

## Meaning

An embedding converts text (or another supported input) into a list of numbers called a **vector**.

The vector represents information about the input in a form that can be compared mathematically. Texts with related meanings can have vectors that are closer together in an embedding space.

## Example

```js
const response = await ai.embeddings.create({
  model: "text-embedding-3-small",
  input: "I love programming.",
});

const vector = response.data[0].embedding;

console.log(vector);
console.log("Vector length:", vector.length);
```

A vector may look like this (illustrative values only):

```js
[0.012, -0.045, 0.087, /* ... more numbers ... */]
```

## Why convert text into numbers?

A computer can compare vectors mathematically. This makes it possible to search for text with a similar meaning, even when it does not use exactly the same words.

Example:

```text
Query: "How can I fix a slow computer?"

Possible related document:
"Steps to improve PC performance."
```

The wording is different, but the meaning is related. Embeddings can help find such relevant content.

## Common workflow

```text
Text
 |
 v
Embedding model
 |
 v
Numerical vector
 |
 v
Store vector in a vector database
 |
 v
Compare a query vector with stored vectors
 |
 v
Retrieve similar content
```

## Use cases

- Semantic search
- Retrieval-Augmented Generation (RAG)
- Recommendation systems
- Similarity search
- Finding related documents

## Remember

An embedding model does not normally write a conversational answer. It converts input into vectors so your application can compare meaning.

---

# 15. File Search

## Meaning

File Search lets a model search information in files that you have added to a vector store.

For example, you can upload a PDF containing your DBMS notes and ask:

```text
What is normalization in DBMS?
```

The system can retrieve relevant passages from your files and use them to help answer the question.

## Conceptual workflow

```text
Upload documents
       |
       v
Add files to a vector store
       |
       v
File Search retrieves relevant content
       |
       v
Model uses retrieved content
       |
       v
Answer is generated
```

A vector store is a managed collection used to organise and search file content. File Search handles retrieval; it is not simply the same thing as attaching an entire PDF to every prompt.

## Example tool configuration

```js
const response = await ai.responses.create({
  model: MODEL,
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["YOUR_VECTOR_STORE_ID"],
    },
  ],
  input: "Explain database normalization using my uploaded notes.",
});

console.log(response.output_text);
```

This example assumes that you have already uploaded the files and created a vector store. Replace the placeholder with your actual vector store ID.

## Use cases

- PDF question-answering application
- Study-material assistant
- Company knowledge assistant
- Internal documentation search
- Research assistant over a collection of files

## Remember

- **Embeddings:** represent text as vectors.
- **Vector store:** stores and organises content for retrieval.
- **File Search:** retrieves relevant file content for the model.
- **RAG:** a pattern in which retrieved information is provided to a model to help it answer.

---

# 16. Web Search

## Meaning

Web Search allows the model to search the web for information that may be newer or more specific than what it can answer from its existing knowledge alone.

## Example

```js
const response = await ai.responses.create({
  model: MODEL,
  tools: [
    {
      type: "web_search",
    },
  ],
  input: "What are the latest developments in AI?",
});

console.log(response.output_text);
```

The model can use the web search tool as part of producing its answer. The model and tool configuration must support web search.

## Why use it?

A model's built-in knowledge may not include the latest events, releases, prices, or announcements. Web Search can retrieve current web information for the task.

## Use cases

- Current news
- Research assistants
- Market research
- Latest technology information
- Finding recent documentation or announcements

## Remember

Web Search retrieves information from the web. It does not mean every result is automatically reliable. For important research, inspect sources and verify key claims.

---

# 17. Code Interpreter

## Meaning

Code Interpreter gives the model access to a managed environment in which it can run code for tasks such as calculations and data analysis.

For example, you can ask it to calculate the average of a dataset and create a chart. It can write and execute code in its environment to help complete the task.

The Code Interpreter environment commonly uses Python, even if your application is written in JavaScript.

## Example tool configuration

```js
const response = await ai.responses.create({
  model: MODEL,
  tools: [
    {
      type: "code_interpreter",
      container: {
        type: "auto",
        file_ids: [],
      },
    },
  ],
  input: "Use Python to calculate 100 * 200 and explain the result.",
});

console.log(response.output_text);
```

This is a basic configuration example. More advanced tasks may involve uploading files and making those files available to the tool.

## What can it help with?

- Mathematical calculations
- Data analysis
- Working with CSV files
- Creating charts
- Running Python code

## Remember

Code Interpreter is not the same as function calling.

- **Function calling:** your application runs a function that you define.
- **Code Interpreter:** the model uses a managed code-execution environment provided through the tool.

---

# 18. Realtime API

## Meaning

The Realtime API is designed for low-latency, interactive experiences. It can support applications where a user speaks and the AI responds in an ongoing conversation.

Unlike a basic request-and-response interaction, a realtime experience can handle a continuing exchange of audio and other supported events.

## Normal request-response interaction

```text
User sends a message
        |
        v
Application sends a request
        |
        v
Model generates a response
        |
        v
Application displays the answer
```

## Realtime interaction

```text
User speaks
     |
     v
Audio is sent through a realtime connection
     |
     v
AI processes the conversation
     |
     v
AI responds with audio
     |
     v
User continues speaking
```

## Use cases

- Live voice assistants
- Interactive voice conversations
- Real-time spoken experiences
- Voice-based learning applications
- Applications that need low-latency audio interaction

## Remember

The Realtime API is for interactive, low-latency sessions. It is different from sending one audio file to a transcription endpoint and waiting for the transcript.

---

# 19. Moderation

## Meaning

Moderation checks text or other supported input for content that may fall into categories defined by the moderation system.

An application can use moderation results as one signal when deciding how to handle user-generated content.

## Example

```js
const moderation = await ai.moderations.create({
  model: "omni-moderation-latest",
  input: "Text you want to check",
});

console.log(moderation.results);
```

The result contains category information and scores that your application can inspect.

## Categories may include

- Hate
- Harassment
- Violence
- Self-harm
- Sexual content

The exact categories and fields depend on the moderation model and API response.

## Example application flow

```text
User submits content
        |
        v
Send content for moderation
        |
        v
Inspect moderation result
        |
        v
Apply your application's safety policy
        |
        v
Allow, review, or reject the content
```

## Use cases

- Community platforms
- AI chat applications
- User-generated content filtering
- Content review workflows

## Important point

Moderation is a signal to support your safety process. Your application must decide what action to take based on the result and its own policy.

---

# 20. Evals

## Meaning

Evals (evaluations) are a systematic way to measure how well an AI application performs on a set of tasks.

Instead of checking only one answer manually, you create test examples and criteria, run the model, and evaluate the outputs.

## Example: AI interview application

Suppose your application asks:

```text
What is a JavaScript closure?
```

You expect a good answer to explain:
- A function.
- Lexical scope.
- Access to variables from an outer scope.

You can evaluate the model's answer against these criteria.

## Simple evaluation idea

| Test question | What a good answer should include |
|---|---|
| What is a closure? | Function, lexical scope, access to outer variables |
| What is a Promise? | Asynchronous operation and its states |
| What is an API? | A defined way for software systems to communicate |

You can score each answer using rules, a human reviewer, or an evaluation model. The evaluation method should match what you want to measure.

## A basic evaluation workflow

```text
Prepare test questions
        |
        v
Define expected qualities / criteria
        |
        v
Run your AI application on the test set
        |
        v
Evaluate the generated answers
        |
        v
Review scores and failures
        |
        v
Improve prompts, tools, or model settings
        |
        v
Run the tests again
```

## Use cases

- AI response quality testing
- Accuracy and relevance evaluation
- Comparing prompts
- Comparing model configurations
- Regression testing after changes

## Remember

Testing one response is not the same as evaluating an AI system. Evals use repeatable examples and criteria so you can compare performance over time.

---

# Important Differences — Quick Revision

| Concepts | Main difference |
|---|---|
| Basic API integration vs Text generation | Integration connects your app to the API; text generation is one capability you use through it. |
| System instructions vs User message | Instructions guide behaviour; the user message contains the task or question. |
| Multi-turn vs Conversation history | Multi-turn is the ongoing exchange; history is the record/context of earlier messages. |
| Streaming vs Normal response | Streaming delivers events as output is generated; normal response is handled after completion. |
| Structured Outputs vs Normal text | Structured Outputs targets a defined data format; normal text is free-form. |
| Function calling vs Tool calling | Function calling exposes custom functions; tool calling is the broader tool-use concept. |
| Vision vs Image generation | Vision understands an input image; image generation creates an image. |
| Audio API vs Realtime API | Audio endpoints handle specific audio tasks; Realtime supports ongoing low-latency interaction. |
| Embeddings vs File Search | Embeddings create vectors; File Search retrieves relevant content from files using a retrieval system. |
| Web Search vs File Search | Web Search looks for web information; File Search searches your configured files. |
| Function calling vs Code Interpreter | Function calling runs your application's function; Code Interpreter runs code in a managed environment. |
| Moderation vs Evals | Moderation checks content against safety categories; Evals measure application quality on test cases. |

---

# Suggested Learning Order

Learn and practise the concepts in this order. The numbering follows the original 1–20 list.

## Stage 1 — API and conversation basics

1. Basic API Integration
2. Text Generation
3. System Instructions
4. User and Assistant Messages
5. Multi-turn Conversations
6. Conversation History

**Practice:** Build a command-line JavaScript tutor that answers a question and handles follow-up questions.

## Stage 2 — Response handling and control

7. Streaming
8. Structured Outputs (JSON)
9. Function Calling
10. Tool Calling

**Practice:** Build a small assistant that streams answers, extracts information into JSON, and calls a calculator function.

## Stage 3 — Multimodal input and output

11. Vision
12. Image Generation
13. Audio API
18. Realtime API

**Practice:** Build small separate experiments: an image-question-answering script, an image-generation script, and a speech-to-text or text-to-speech script.

## Stage 4 — Retrieval and application quality

14. Embeddings
15. File Search
16. Web Search
17. Code Interpreter
19. Moderation
20. Evals

**Practice:** Build a PDF study assistant, add a moderation check to user input, and create a small test set to evaluate answer quality.

---

# Final Mental Model

These 20 concepts are not 20 unrelated APIs. They are capabilities that can be combined to build AI applications.

```text
                 JavaScript Application
                          |
                          v
                     OpenAI API
                          |
       +------------------+-------------------+
       |                  |                   |
       v                  v                   v
  Conversation        Multimodal           Tools
  - Text              - Vision             - Function calling
  - Instructions     - Image generation   - Web Search
  - History           - Audio              - File Search
  - Streaming         - Realtime           - Code Interpreter
       |                  |                   |
       +------------------+-------------------+
                          |
                          v
                Application features
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
    Embeddings         Moderation           Evals
    and retrieval      and safety           and testing
```

## Before using an example

- Replace `YOUR_MODEL` with a model that supports the capability.
- Replace placeholder IDs and URLs with real values.
- Keep API keys on the server or in a secure environment variable.
- Check the current API documentation for model availability, supported parameters, and exact request formats.
- Handle errors with `try/catch` in scripts you plan to run.
- Validate model output before using it for important application actions.

## A simple error-handling pattern

```js
try {
  const response = await ai.responses.create({
    model: MODEL,
    input: "Explain what an API is.",
  });

  console.log(response.output_text);
} catch (error) {
  console.error("OpenAI API request failed:", error.message);
}
```

**The most important idea:** learn what each capability does, understand the request and response, and then practise it with a small standalone JavaScript program. You do not need to build a complete backend application while learning each concept.
