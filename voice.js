import express from "express";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";



  const app = express();

























app.listen(3000, () => {
  console.log("Server is running on port 3000");
});