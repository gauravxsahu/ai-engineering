import express from "express";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs";
import { Messages } from "openai/resources/chat/completions.mjs";





const app = express();

/*
Speech-to-Text
Text-to-Speech
Audio Understanding
Audio-to-Audio
Realtime API
Voice Agents
*/

/*

This application can use all six concepts.
Concept             	What it does	                   Example
Speech-to-Text   	 Converts speech into text	          Voice → "Hello"
Text-to-Speech	     Converts text into speech	          "Hello" → Voice
Audio Understanding	 Understands audio and its meaning	   Understands user's question
Audio-to-Audio	     Audio input → Audio response	       Voice question → Voice answer
Realtime API	         Enables live voice conversations	   Talk continuously with AI
Voice Agents	         An AI agent that communicates         AI English tutor
                      through voice	
*/
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/*
Speech-to-Text (STT)
What is Speech-to-Text?
Speech-to-Text means converting human speech into written text.

       User speaks
            |
            v
       Microphone
            |
            v
       Audio Recording
            |
            v
       Audio File
            |
            v
      OpenAI API
            |
            v
    Transcription Model
            |
            v
       Text Output
       
*/
/*
const speechToText = await client.audio.transcriptions.create(
    {
        file:fs.createReadStream("Recording 2.flac"),  //fs.createReadStream() is a Node.js method used to read a file in chunks instead of loading the entire file into memory.
        model:"whisper-1"
    }
);

//print the transcribed text
console.log("Transcribed Text:", speechToText.text);  
-----------------------------------------------------------------------------
*/


/*
Text-to-Speech (TTS)
What is Text-to-Speech?
Text-to-Speech is the opposite of Speech-to-Text.

It converts written text into human-like speech.
*/
/*
       Text Input
           |
           v
       OpenAI API
           |
           v
      TTS Model
           |
           v
      Voice Selection
           |
           v
     Audio Generation
           |
           v
       MP3 / WAV
           |
           v
        Speaker
*/
/*  

const textToSpeech = await client.audio.speech.create({
    model:"gpt-4o-mini-tts",
    voice:"alloy",
    input:"hello, I am an AI voice assistant. How can I help you today?",
    instructions:"speak in friendly and natural tone"
});

const audioBuffer = Buffer.from(await textToSpeech.arrayBuffer());

fs.writeFileSync("output.mp3", audioBuffer);
console.log("Audio file generated: output.mp3");
*/

/*
Audio Understanding
Audio Understanding means an AI model processes audio to understand its content, context and intent, and can perform tasks based on it.
Approach A: STT
Approach B: Audio Understanding

Audio
  |
  v
Audio-capable LLM
  |
  v
Understands the question
  |
  v
Reasons about the question
  |
  v
Generates Answer

*/

/*
const audiobuffer = fs.readFileSync("Recording_3.mp3");

//convert audio buffer to base64
const base64Audio = audiobuffer.toString("base64");

const audioUnderstandingResponse = await client.chat.completions.create({
    model: "gpt-audio-1.5",
    modalities:["text"],
    messages: [
        {
            role: "user",
            
            
            content: [
                {
                    type: "text",
                    text: "listen to this audio and  answer the question"
                },
                {
                    type: "input_audio",
                    input_audio: {
                        data: base64Audio,
                        format: "mp3"
                    }
                }
            ]
        }]
})

console.log(audioUnderstandingResponse.choices[0].message.content);

*/

//Audio-to-Audio (Speech-to-Speech)

















app.listen(3000, () => {
    console.log("Server is running on port 3000");
});