# Google Gemini API with JavaScript — Complete Learning Notes (1–20)

> This guide explains how to use Gemini from JavaScript/Node.js, following the same learning structure as the OpenAI 1–20 notes.
>
> **Important API note (November 2026):** Google's current documentation recommends the **Interactions API** for new Gemini projects. The older `generateContent` API is still supported, and some specialised operations (such as embeddings) use their own model methods. This guide uses `@google/genai` and shows the current Interactions API where appropriate. Some capabilities do not have a one-to-one equivalent to OpenAI's feature name; those differences are called out instead of pretending they are identical.

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
17. [Code Execution](#17-code-execution)
18. [Realtime API / Live API](#18-realtime-api--live-api)
19. [Safety and Moderation](#19-safety-and-moderation)
20. [Evals](#20-evals)

---

# Before You Start

## Requirements

- Node.js installed.
- Basic JavaScript: variables, functions, arrays, objects, `async/await`, and `try/catch`.
- A Gemini API key from Google AI Studio.
- A project folder for your experiments.

## 1. Create a project

```bash
mkdir gemini-learning
cd gemini-learning
npm init -y
npm install @google/genai dotenv
```

Use ES modules by adding this to `package.json`:

```json
{
  "type": "module"
}
```

## 2. Create a `.env` file

```env
GEMINI_API_KEY=your_api_key_here
```

Do not commit your API key to GitHub or expose it in frontend/browser code. Add `.env` to `.gitignore`:

```gitignore
.env
node_modules
```

## 3. Create `index.js`

```js
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Use a model that is available to your API project
// and supports the capability you are testing.
const MODEL = "YOUR_GEMINI_MODEL";
```

Replace `YOUR_GEMINI_MODEL` with a current model ID available to your project. Model IDs and supported features can change, so check the official model list.

## A useful mental model

```text
Your JavaScript program
        |
        | sends prompt / media / settings
        v
     Gemini API
        |
        | returns text / structured data / tool request
        v
Your JavaScript program handles the result
```

Gemini generates or interprets information. Your own application is still responsible for its database, business logic, permissions, and real-world actions.

---

# 1. Basic API Integration

## Meaning

Basic API integration means connecting your JavaScript application to Google's Gemini models through the Gemini API.

An API allows two software systems to communicate. Your Node.js program sends input to Gemini, and Gemini returns a response.

## Example using the Interactions API

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "Hello! Introduce yourself in one sentence.",
});

console.log(interaction.output_text);
```

## Understand each part

- `ai`: the Gemini client created with `GoogleGenAI`.
- `interactions.create()`: creates a model interaction.
- `model`: tells Gemini which model to use.
- `input`: the text or other content you send.
- `interaction`: the returned interaction object.
- `interaction.output_text`: convenient access to the generated text.

## Request flow

```text
JavaScript sends input
        |
        v
Gemini processes the request
        |
        v
Gemini returns an interaction
        |
        v
Your code reads output_text
```

## Why use it?

It lets your JavaScript programs use Gemini capabilities such as text generation, image understanding, audio, tools, and structured output.

**Remember:** API integration is the connection. Text generation, vision, embeddings, and other features are capabilities you use through the API.

---

# 2. Text Generation

## Meaning

Text generation means asking Gemini to generate text from the input you provide.

The output may be an explanation, answer, summary, email, story, or code.

## Example

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "Explain JavaScript Promises with a simple example.",
});

console.log(interaction.output_text);
```

## What happens?

1. Your program sends the prompt.
2. Gemini interprets the prompt.
3. Gemini generates a response.
4. Your program reads `output_text`.

For example, Gemini may explain pending, fulfilled, and rejected Promise states and provide a JavaScript example.

## Use cases

- Question answering
- Explaining technical concepts
- Summarising text
- Content generation
- Drafting emails
- Generating or explaining code

## Important point

Generated text is not automatically guaranteed to be correct. Validate important information before using it in important decisions or application actions.

---

# 3. System Instructions

## Meaning

System instructions tell Gemini how it should behave while answering. They can define the model's role, response style, and task rules.

Think of them as behaviour guidelines for the model.

## Example

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  system_instruction: `
    You are a JavaScript teacher.
    Explain concepts in simple English.
    Give a small code example.
    Explain difficult words for beginners.
  `,
  input: "What is a closure?",
});

console.log(interaction.output_text);
```

## Understand the example

- `system_instruction`: tells Gemini how it should respond.
- `input`: contains the actual user question.

The instructions say to behave like a JavaScript teacher. The user asks, “What is a closure?”

## Use cases

- AI tutor
- Customer-support assistant
- Coding assistant
- Interview-preparation assistant
- Writing assistant

## Important point

System instructions guide the model. They are not a replacement for application-side security. Do not rely on a prompt alone to authorise payments, protect private data, or enforce user permissions.

---

# 4. User and Assistant Messages

## Meaning

A conversation contains messages from different roles. The role identifies who is speaking.

Common conversation roles:

| Role | Meaning |
|---|---|
| `user` | The user's message |
| `model` | Gemini's response |
| System instruction | Application-provided behaviour rules; supplied separately as `system_instruction` in the Interactions API |

## Example with the Interactions API

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "What is Node.js?",
});

console.log(interaction.output_text);
```

In the Interactions API, a plain string in `input` is treated as the user's input. The returned `model_output` represents the model's answer.

## What does a role help with?

Roles separate the user's request from the model's response. This becomes important when you manage multiple messages and conversation history.

## Remember

The older `generateContent` API represents chat turns with roles such as `user` and `model` inside `contents`. Do not blindly copy the message format from one API into the other; their request structures differ.

---

# 5. Multi-turn Conversations

## Meaning

A multi-turn conversation means having several connected exchanges with Gemini.

A turn is one step in a conversation. The user asks a question, Gemini answers, and the user can ask a follow-up using the earlier context.

## Example conversation

```text
User: What is React?
Gemini: React is a JavaScript library for building user interfaces.

User: Why do we use it?
Gemini: It helps build reusable and interactive UI components.

User: Give me an example.
Gemini: Here is a simple React component...
```

The second question refers to React without repeating the full topic.

## JavaScript example using `previous_interaction_id`

```js
const first = await ai.interactions.create({
  model: MODEL,
  input: "I am learning React.",
});

console.log("Gemini:", first.output_text);

const second = await ai.interactions.create({
  model: MODEL,
  previous_interaction_id: first.id,
  input: "What should I learn first?",
});

console.log("Gemini:", second.output_text);
```

## What does `previous_interaction_id` do?

It points to an earlier interaction. Gemini uses the earlier conversation context when creating the next response.

```text
First user input
      |
      v
First interaction (has an ID)
      |
      | previous_interaction_id
      v
Follow-up input
      |
      v
Gemini continues the conversation
```

## Remember

Multi-turn describes the conversation pattern. It does not automatically mean your own application has permanently stored the conversation in its database.

---

# 6. Conversation History

## Meaning

Conversation history is the record of previous user and model messages. Your application can keep this history and provide it when making another request.

Gemini's Interactions API can manage conversation state on the server using `previous_interaction_id`. You can also manage history yourself when you need a stateless/client-managed flow.

## Stateful example

```js
const first = await ai.interactions.create({
  model: MODEL,
  input: "My name is Gaurav.",
});

const second = await ai.interactions.create({
  model: MODEL,
  previous_interaction_id: first.id,
  input: "What is my name?",
});

console.log(second.output_text);
```

The server uses the previous interaction to continue the conversation.

## Difference

| Multi-turn conversation | Conversation history |
|---|---|
| Describes multiple connected exchanges. | The record/context of earlier exchanges. |
| Describes how the conversation proceeds. | Describes what earlier information is available. |
| Example: user asks a follow-up. | Example: previous messages are available to the next request. |

## Important storage note

The Interactions API stores interactions by default to support server-side state. The official documentation describes retention periods and the `store` setting. If you use `store: false`, you cannot continue later using `previous_interaction_id`; you must manage and send the needed history yourself. Check current retention and storage controls before using this with real user data.

---

# 7. Streaming

## Meaning

Streaming means receiving Gemini's response in pieces as it is generated instead of waiting for the complete answer.

Without streaming, your application waits for the whole response. With streaming, it can display text as each chunk arrives.

## Without streaming

```text
User asks a question
        |
        v
Wait for complete response
        |
        v
Display answer
```

## With streaming

```text
User asks a question
        |
        v
Gemini starts generating
        |
        v
Chunk 1 arrives -> display it
        |
        v
Chunk 2 arrives -> display it
        |
        v
Chunk 3 arrives -> display it
        |
        v
More chunks arrive
```

## JavaScript example using the Interactions API

```js
const stream = await ai.interactions.create({
  model: MODEL,
  input: "Explain artificial intelligence in simple English.",
  stream: true,
});

for await (const event of stream) {
  if (event.event_type === "step.delta" && event.delta.type === "text") {
    process.stdout.write(event.delta.text);
  }
}
```

## Understand the important parts

- `stream: true`: asks Gemini to stream the interaction.
- `for await...of`: reads incoming events asynchronously.
- `event_type`: identifies the kind of event.
- `step.delta`: an incremental update to a step.
- `delta.type === "text"`: checks that the update contains text.
- `delta.text`: the new text portion.
- `process.stdout.write()`: prints the text without adding a newline after every chunk.

## Note about the older API

With `generateContent`, the corresponding method is `generateContentStream()` and the chunks commonly expose `chunk.text`. Do not mix its chunk-handling code with Interactions API event handling.

## Use cases

- Chat interfaces
- Live AI responses
- AI writing assistants
- Applications where early output improves responsiveness

---

# 8. Structured Outputs (JSON)

## Meaning

Structured output means asking Gemini to return data in a defined format, such as JSON, instead of an unrestricted paragraph.

This is useful when your JavaScript program needs predictable fields.

## Example problem

Input:

```text
Extract name, age, and skills:
"My name is Gaurav. I am 21. I know JavaScript and React."
```

Expected output:

```json
{
  "name": "Gaurav",
  "age": 21,
  "skills": ["JavaScript", "React"]
}
```

## JavaScript example

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: `
    Extract the name, age, and skills from this text:
    Gaurav is 21 years old and knows JavaScript and React.
  `,
  response_format: {
    type: "text",
    mime_type: "application/json",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "integer" },
        skills: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["name", "age", "skills"],
    },
  },
});

const details = JSON.parse(interaction.output_text);
console.log(details.name);
console.log(details.skills);
```

## Understand the schema

- `mime_type: "application/json"`: requests JSON output.
- `schema`: describes the expected JSON structure.
- `type: "object"`: output should be an object.
- `properties`: defines the fields and their types.
- `required`: lists required fields.
- `items`: defines the type of each array item.

Exact schema support and configuration can depend on the model/API version. Check the current Structured Outputs guide before using advanced JSON Schema keywords.

## Use cases

- Resume parsing
- Data extraction
- Classification
- Structured application responses
- Converting unstructured text into objects

## Remember

Structured output controls the format, not the truth of the values. Validate important data in your JavaScript application.

---

# 9. Function Calling

## Meaning

Function calling lets Gemini request that your application execute one of your own JavaScript functions.

Gemini does not directly run your local JavaScript function. It returns a function name and arguments. Your code validates the request, executes the function, and sends the result back to Gemini.

## Example situation

User asks:

```text
What is 25 multiplied by 10?
```

Your JavaScript function:

```js
function multiply(a, b) {
  return a * b;
}
```

Gemini can request the `multiply` function with `a = 25` and `b = 10`.

## Step 1: Declare the function

```js
const multiplyTool = {
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
  },
};
```

This declaration tells Gemini the function name, what it does, and the arguments it needs.

## Step 2: Send the request with the tool declaration

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "What is 25 multiplied by 10?",
  tools: [multiplyTool],
});

console.log(interaction.steps);
```

Gemini may return a step whose type is `function_call`.

## Step 3: Execute the function and send its result back

```js
function multiply(a, b) {
  return a * b;
}

const functionCall = interaction.steps.find(
  (step) => step.type === "function_call"
);

if (functionCall?.name === "multiply") {
  const { a, b } = functionCall.arguments;

  // Validate arguments before executing in a real application.
  const result = multiply(a, b);

  const finalInteraction = await ai.interactions.create({
    model: MODEL,
    previous_interaction_id: interaction.id,
    tools: [multiplyTool],
    input: [
      {
        type: "function_result",
        name: functionCall.name,
        call_id: functionCall.id,
        result: [
          {
            type: "text",
            text: JSON.stringify({ result }),
          },
        ],
      },
    ],
  });

  console.log(finalInteraction.output_text);
}
```

## Function-calling flow

```text
User asks a question
        |
        v
Gemini decides a function is needed
        |
        v
Gemini returns function name + arguments
        |
        v
Your JavaScript validates and executes the function
        |
        v
Your code sends the result back to Gemini
        |
        v
Gemini creates the final response
```

## Use cases

- Calculator
- Weather API
- Database lookup
- Order-status lookup
- Application-specific operations

## Important safety point

Do not blindly execute every function request. Validate the function name and arguments, check permissions, and ask for confirmation before sensitive actions such as payments or deleting data.

---

# 10. Tool Calling

## Meaning

Tool calling is the broader ability to let Gemini use tools to retrieve information or perform tasks.

Gemini supports built-in tools as well as custom function declarations. The exact tools available depend on the API, model, and project.

## Examples of tools

- Google Search
- Code execution
- URL context (where supported)
- File search (where supported)
- Custom JavaScript functions

## Example: Google Search tool

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "Find recent developments in JavaScript.",
  tools: [
    {
      type: "google_search",
    },
  ],
});

console.log(interaction.output_text);
```

The built-in search tool can be executed by the API as part of generating the answer. Availability depends on the model and API.

## Function calling vs tool calling

| Function calling | Tool calling |
|---|---|
| Exposes your own functions to Gemini. | Broader tool-use capability. |
| Your application executes the custom function. | A tool may be built in or custom. |
| Example: `multiply(25, 10)`. | Example: Google Search, Code Execution, or a custom function. |

## Remember

Function calling is one form of tool use. Tool calling is the broader concept.

---

# 11. Vision (Image Understanding)

## Meaning

Vision means providing an image to Gemini and asking it to understand or analyse what is in the image.

You can ask about a photo, screenshot, chart, diagram, or supported document image.

## Example: send an image URL

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: [
    {
      type: "text",
      text: "Describe this image.",
    },
    {
      type: "image",
      uri: "https://example.com/image.jpg",
      mime_type: "image/jpeg",
    },
  ],
});

console.log(interaction.output_text);
```

Use an image URI that the API can access and a matching MIME type. The SDK/API also supports other ways to provide image bytes, such as base64 data.

## What can Gemini do?

- Describe objects in a picture.
- Read visible text.
- Explain a screenshot.
- Interpret a diagram.
- Answer questions about an image.

## Use cases

- Image analysis
- Screenshot understanding
- Document understanding
- Visual question answering
- Image-based assistants

## Vision vs image generation

- **Vision:** give Gemini an existing image and ask it to understand the image.
- **Image generation:** ask a model to create a new image.

---

# 12. Image Generation

## Meaning

Image generation means creating a new image from a text prompt. Gemini's image-generation capabilities are model-specific; use a model that supports image output.

## Example concept

Prompt:

```text
Generate a futuristic city at night with neon lights.
```

A common Gemini image-generation pattern uses a model through the generation API and reads image data from the returned parts. The exact model ID and response structure depend on the currently available image-generation model.

## Example using the `generateContent` method

```js
const response = await ai.models.generateContent({
  model: "YOUR_IMAGE_GENERATION_MODEL",
  contents: "Generate a futuristic city at night with neon lights.",
});

for (const part of response.candidates?.[0]?.content?.parts ?? []) {
  if (part.text) {
    console.log(part.text);
  }

  if (part.inlineData) {
    console.log("Image MIME type:", part.inlineData.mimeType);
    console.log("Image data is returned as base64.");
    // Decode part.inlineData.data and save it as an image file.
  }
}
```

This is a response-inspection example. Add file-writing code if you want to save the returned base64 image to disk.

## What makes a useful prompt?

A prompt can describe:
- Subject
- Setting
- Style
- Lighting
- Composition
- Aspect or framing requirements, if supported

Example:

```text
A futuristic city at night, glass skyscrapers,
neon signs, rainy streets, cinematic lighting,
wide-angle composition.
```

## Use cases

- Concept art
- Illustrations
- Product visuals
- Marketing graphics
- Creative design exploration

## Remember

Not every text model generates images. Choose an image-generation-capable model and follow its current output format.

---

# 13. Audio API

## Meaning

Gemini supports audio input and audio-related tasks. Depending on the model and endpoint, you can provide audio for understanding or transcription, and use audio-capable models to generate speech.

## Important audio tasks

| Task | Meaning |
|---|---|
| Audio understanding | Ask Gemini to interpret audio input. |
| Transcription | Convert spoken audio into text. |
| Speech generation | Generate spoken audio from text, when supported by the model. |
| Live audio interaction | Have an ongoing voice conversation through the Live API. |

## Example: provide an audio file for understanding

```js
import fs from "node:fs";

const audioBase64 = fs.readFileSync("question.mp3").toString("base64");

const interaction = await ai.interactions.create({
  model: MODEL,
  input: [
    {
      type: "text",
      text: "Transcribe this audio and summarise what the speaker says.",
    },
    {
      type: "audio",
      data: audioBase64,
      mime_type: "audio/mpeg",
    },
  ],
});

console.log(interaction.output_text);
```

The audio MIME type must match the actual file. Supported audio formats and model capabilities vary.

## Example workflow

```text
User records a question
        |
        v
Application sends audio to Gemini
        |
        v
Gemini understands / transcribes the audio
        |
        v
Application receives text or an answer
        |
        v
An audio-capable model can speak a response
```

## Use cases

- Voice assistants
- Audio transcription
- Voice-based learning
- Interview practice
- Audio summarisation

## Remember

Audio understanding, transcription, text-to-speech, and Live voice interaction are related but distinct capabilities. Check the model and endpoint for the exact task.

---

# 14. Embeddings

## Meaning

An embedding converts text into a list of numbers called a **vector**.

The vector represents information about the text in a numerical form. Your application can compare vectors to find text with related meaning.

## Example using the embeddings model method

```js
const result = await ai.models.embedContent({
  model: "YOUR_GEMINI_EMBEDDING_MODEL",
  contents: "I love programming.",
});

console.log(result.embeddings);
```

The exact embedding model ID and response shape should be checked in the current embedding documentation.

## What does a vector look like?

Illustrative example:

```js
[0.012, -0.045, 0.087, /* ... more numbers ... */]
```

## Why convert text into numbers?

A computer can compare vectors mathematically. This helps retrieve text with similar meaning even when the exact words are different.

Example:

```text
Query: "How do I make my computer faster?"

Related document:
"Tips for improving PC performance."
```

The wording differs, but the meanings are related.

## Common workflow

```text
Text
 |
 v
Gemini embedding model
 |
 v
Numerical vector
 |
 v
Store vector in a vector database
 |
 v
Embed a user's search query
 |
 v
Compare vectors
 |
 v
Retrieve similar content
```

## Use cases

- Semantic search
- RAG
- Recommendation systems
- Similarity search
- Document retrieval

## Remember

Embeddings do not normally generate a conversational answer. They create vectors that your application can use for search and similarity.

---

# 15. File Search

## Meaning

File search means allowing Gemini to retrieve relevant information from a collection of your documents.

The exact implementation depends on the Gemini product/API you use. The Interactions API supports a file-search tool in supported configurations; Google's broader Vertex AI ecosystem also has document retrieval and RAG options.

## Example situation

You have uploaded your DBMS notes and want to ask:

```text
What is normalization in DBMS?
```

A retrieval system searches the documents for relevant passages and makes them available to the model.

## Conceptual workflow

```text
Upload documents
       |
       v
Prepare / index the files in a supported retrieval system
       |
       v
File search retrieves relevant passages
       |
       v
Gemini uses the retrieved information
       |
       v
Answer is generated
```

## Important distinction

Uploading a file and searching a knowledge base are not always the same operation. A file upload makes a file available to the API; a search/retrieval system indexes content and retrieves relevant portions for a question.

## Use cases

- PDF question-answering assistant
- Study-material assistant
- Company knowledge assistant
- Internal documentation search
- Research over a collection of documents

## Remember

- **Embeddings:** represent text as vectors.
- **Vector store / retrieval index:** stores content for similarity search.
- **File search:** retrieves relevant information from files.
- **RAG:** a pattern where retrieved information is provided to a model to help answer a question.

The exact file-search tool configuration and availability can change; use the current official File Search guide for your project and model.

---

# 16. Web Search

## Meaning

Web Search allows Gemini to retrieve information from Google Search as part of answering a prompt.

It is useful when a question needs current information that may not be in the model's built-in knowledge.

## Example

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "Find recent developments in artificial intelligence.",
  tools: [
    {
      type: "google_search",
    },
  ],
});

console.log(interaction.output_text);
```

## Why use it?

A model's built-in knowledge may not include the latest events, product releases, prices, or announcements. Search can retrieve current web information for the task.

## Use cases

- Latest news
- Research assistants
- Market research
- Current technology information
- Recent documentation and announcements

## Remember

Web search can retrieve current information, but your application should still inspect sources and verify important claims.

---

# 17. Code Execution

## Meaning

Code Execution allows Gemini to write and run code in a managed execution environment for tasks such as calculations and data analysis.

This is different from function calling: with function calling, your application runs a function you wrote; with Code Execution, the model uses the API's managed code-execution tool.

## Example

```js
const interaction = await ai.interactions.create({
  model: MODEL,
  input: "Use code execution to calculate 100 * 200 and explain the result.",
  tools: [
    {
      type: "code_execution",
    },
  ],
});

console.log(interaction.output_text);
```

The model may use the code-execution tool as part of answering the question. The tool's language/runtime and supported operations depend on Google's managed environment.

## Use cases

- Mathematical calculations
- Data analysis
- Working with supported data files
- Running code to support an answer
- Charts and computational tasks, where supported

## Function calling vs Code Execution

| Function calling | Code Execution |
|---|---|
| Your application defines a function. | Gemini uses a managed execution tool. |
| Your JavaScript program runs the function. | The tool runs code in its managed environment. |
| Example: call your own `getOrderStatus()` function. | Example: execute code to calculate a statistic. |

---

# 18. Realtime API / Live API

## Meaning

Gemini Live API supports low-latency, ongoing interactions, especially voice-based experiences. Depending on the model and configuration, it can support audio and other real-time modalities.

This is different from sending one audio file and waiting for a transcription.

## Normal request-response

```text
User sends a message
        |
        v
Application sends request
        |
        v
Gemini generates response
        |
        v
Application displays answer
```

## Live interaction

```text
User speaks
     |
     v
Live session receives audio
     |
     v
Gemini processes the conversation
     |
     v
Gemini responds
     |
     v
User continues speaking
```

## SDK entry point

The JavaScript SDK exposes Live functionality through `ai.live`. A Live session requires connection setup and event handling; it is not just a normal `interactions.create()` call.

```js
// Conceptual SDK entry point:
const live = ai.live;

// Use the current Live API guide for the exact
// connect configuration, callbacks, and audio transport.
console.log("Live API service:", Boolean(live));
```

## Use cases

- Live voice assistants
- Interactive spoken conversations
- Real-time learning assistants
- Voice-based interview practice
- Applications that need low-latency audio interaction

## Remember

The Live API is for ongoing real-time sessions. Audio transcription is usually a separate, single-task workflow.

---

# 19. Safety and Moderation

## Meaning

Gemini provides safety settings and safety-related response information to help applications manage potentially harmful content.

This is not exactly the same API shape as OpenAI's separate Moderations endpoint. In Gemini, safety controls are generally configured as part of content generation, and the response can include safety feedback or blocked-candidate information.

## Safety categories

Depending on the model/API, categories can include areas such as:
- Harassment
- Hate speech
- Sexually explicit content
- Dangerous content

The available categories and thresholds depend on the API version and model.

## Conceptual example using `generateContent`

```js
import {
  GoogleGenAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/genai";

const response = await ai.models.generateContent({
  model: MODEL,
  contents: "Your prompt goes here.",
  config: {
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  },
});

console.log(response.text);
console.log(response.candidates?.[0]?.finishReason);
console.log(response.promptFeedback);
```

This is an example of configuring safety behaviour for generation. It is not a general-purpose moderation endpoint that you can assume returns the same result structure as OpenAI Moderation.

## Typical application flow

```text
User submits content
        |
        v
Gemini request is processed with safety settings
        |
        v
Inspect response / safety feedback
        |
        v
Apply your application's safety policy
        |
        v
Allow, review, or handle blocked content
```

## Use cases

- Safer AI chat experiences
- User-generated content workflows
- Content filtering
- Handling blocked or unsafe model responses

## Important point

Safety settings are one part of an application's safety design. Your application still needs its own validation, permissions, reporting, and review logic.

---

# 20. Evals

## Meaning

Evals (evaluations) are a systematic way to measure how well an AI application performs on a set of tasks.

You prepare test inputs, define what a good answer should contain, run the model, and evaluate the results.

## Example: AI interview application

Question:

```text
What is a JavaScript closure?
```

A good answer should explain:
- A function.
- Lexical scope.
- Access to variables from an outer scope.

You can evaluate the model's answer against these criteria.

## Simple evaluation table

| Test question | What a good answer should include |
|---|---|
| What is a closure? | Function, lexical scope, access to outer variables |
| What is a Promise? | Asynchronous operation and its states |
| What is an API? | A defined way for software systems to communicate |

## Basic evaluation workflow

```text
Prepare test questions
        |
        v
Define expected qualities / criteria
        |
        v
Run your Gemini application on the test set
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

## Is there a single Gemini API call called `evals`?

Do not assume there is a direct one-to-one Gemini Developer API method matching OpenAI's Evals feature. Evaluation can be built with your own test harness, automated graders, or Google's evaluation tooling in its broader AI platform.

## Use cases

- AI response quality testing
- Accuracy and relevance evaluation
- Prompt comparison
- Model comparison
- Regression testing after prompt or model changes

## Remember

Testing one response manually is not the same as evaluating an AI system. Evals use repeatable test cases and criteria so that you can measure changes over time.

---

# Important Differences — Quick Revision

| Concept | Gemini approach |
|---|---|
| Basic API integration | `GoogleGenAI` client from `@google/genai`. |
| Text generation | `ai.interactions.create()` with text input. |
| System instructions | `system_instruction` in an interaction. |
| User and assistant messages | User input and model output steps; older API uses `user` and `model` roles. |
| Multi-turn conversation | `previous_interaction_id` or a chat/history workflow. |
| Conversation history | Server-side state or application-managed history. |
| Streaming | `stream: true` with typed interaction events; older API uses `generateContentStream()`. |
| Structured output | JSON MIME type and schema in response format configuration. |
| Function calling | Declare a function tool, execute it in your code, send a function result. |
| Tool calling | Built-in tools and custom function declarations. |
| Vision | Send image input with text. |
| Image generation | Use an image-generation-capable model. |
| Audio | Audio understanding, transcription, speech and related audio-capable models. |
| Embeddings | Embedding model through `ai.models.embedContent()`. |
| File search | Supported file-search/retrieval tool or Google retrieval/RAG product. |
| Web search | Built-in `google_search` tool where supported. |
| Code execution | Built-in `code_execution` tool where supported. |
| Realtime | Gemini Live API through `ai.live`. |
| Moderation | Safety settings and safety feedback; not the same endpoint shape as OpenAI Moderations. |
| Evals | Evaluation harness/tooling; not assumed to be a one-to-one Gemini API endpoint. |

---

# Suggested Learning Order

## Stage 1 — API and conversation basics

1. Basic API Integration
2. Text Generation
3. System Instructions
4. User and Assistant Messages
5. Multi-turn Conversations
6. Conversation History

**Practice:** Build a command-line Gemini tutor that answers a question and handles follow-up questions.

## Stage 2 — Response handling and tools

7. Streaming
8. Structured Outputs
9. Function Calling
10. Tool Calling

**Practice:** Build an assistant that streams answers, extracts JSON, and calls a calculator function.

## Stage 3 — Multimodal features

11. Vision
12. Image Generation
13. Audio API
18. Live API

**Practice:** Create separate scripts for image understanding, image generation, and audio understanding.

## Stage 4 — Retrieval, execution, and quality

14. Embeddings
15. File Search
16. Web Search
17. Code Execution
19. Safety and Moderation
20. Evals

**Practice:** Build a study assistant over documents, add web search, inspect safety feedback, and create a small evaluation dataset.

---

# Final Mental Model

```text
                  JavaScript Application
                           |
                           v
                       Gemini API
                           |
        +------------------+-------------------+
        |                  |                   |
        v                  v                   v
   Conversations       Multimodal            Tools
   - Text              - Vision              - Google Search
   - Instructions     - Image generation    - Function calling
   - History           - Audio               - File search
   - Streaming         - Live API            - Code execution
        |                  |                   |
        +------------------+-------------------+
                           |
                           v
                 Application capabilities
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
    Embeddings          Safety              Evals
    and retrieval       controls            and testing
```

## Before running examples

- Replace `YOUR_GEMINI_MODEL` with a currently available model ID.
- Make sure the model supports the feature you are testing.
- Keep `GEMINI_API_KEY` private and on the server.
- Replace example image URLs, file IDs, and other placeholders.
- Check the current official documentation for exact model names, supported parameters, and API availability.
- Add `try/catch` to scripts you intend to run.
- Validate model output before using it for important application actions.

## Simple error-handling pattern

```js
try {
  const interaction = await ai.interactions.create({
    model: MODEL,
    input: "Explain what an API is.",
  });

  console.log(interaction.output_text);
} catch (error) {
  console.error("Gemini API request failed:", error.message);
}
```

**Most important idea:** Learn one capability at a time. Understand what you send, what Gemini returns, and how your JavaScript code handles that result. You do not need to build a complete backend application while learning each concept.

---

# Official Documentation

Use these official resources when checking current model names, request formats, and feature availability:

- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Interactions API overview](https://ai.google.dev/gemini-api/docs/interactions-overview)
- [JavaScript SDK documentation](https://googleapis.github.io/js-genai/)
- [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
- [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Streaming](https://ai.google.dev/gemini-api/docs/streaming)
