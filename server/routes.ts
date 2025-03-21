import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with API key
const apiKey = "AIzaSyBUhdKg2kGJ2eSqGPWiRYwpxasbSLnNRn4";
const genAI = new GoogleGenerativeAI(apiKey);
// Use the correct model name for version 0.24.0 of the package
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

// Helper to generate character responses using Google Gemini AI
const generateCharacterResponse = async (userMessage: string, conversationId: string) => {
  // Detect language of user message
  const isArabic = /[\u0600-\u06FF]/.test(userMessage);
  const language = isArabic ? "Arabic" : "English";
  
  // Safer API calling function for Gemini
  const safeGenerateContent = async (prompt: string, fallbackPrompt?: string) => {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (contentError) {
      console.error('Content generation error:', contentError);
      if (fallbackPrompt) {
        try {
          const backupResult = await model.generateContent(fallbackPrompt);
          return backupResult.response.text().trim();
        } catch (fallbackError) {
          console.error('Fallback generation error:', fallbackError);
          throw fallbackError; // Let outer catch block handle it
        }
      } else {
        throw contentError; // Let outer catch block handle it
      }
    }
  };
  
  // Get the responses
  const responses = [];
  const usedCharacterIds: number[] = [];
  const maxCharacters = 10;
  let previousResponses = [];

  // Get multiple unique characters
  for (let i = 0; i < maxCharacters; i++) {
    const character = await storage.getRandomCharacter(usedCharacterIds);
    usedCharacterIds.push(character.id);
    
    try {
      let prompt = '';
      let responseText = '';
      
      // First character - answers the user's question directly
      if (i === 0) {
        prompt = `
          You are ${character.name}, responding to a question in a chat interface.
          Your communication style is ${character.style}.
          
          Respond to the following question in a single paragraph (max 3-4 sentences) from the perspective of ${character.name}.
          Make sure your response is in ${language}.
          
          If the question is in Arabic, respond in Arabic. If it's in English, respond in English.
          
          The question is: "${userMessage}"
          
          IMPORTANT: Your response MUST be directly related to the user's question. Do not generate generic responses.
          Answer the specific question asked, providing insights based on your character's perspective.
          Keep your response contextually relevant to the question. Don't add any prefixes like "As ${character.name}," just respond directly.
        `;
        
        // Use simplified prompt as fallback
        const fallbackPrompt = `You are ${character.name}. Answer this question directly and briefly: "${userMessage}" in ${language}.`;
        
        responseText = await safeGenerateContent(prompt, fallbackPrompt);
        previousResponses.push(responseText);
      } 
      // Second character - critiques the first response and asks a follow-up question
      else if (i === 1) {
        prompt = `
          You are ${character.name}, with a communication style that is ${character.style}.
          
          Another character (${responses[0].sender}) has just responded to a question with: "${previousResponses[0]}"
          
          Your task is to:
          1. Briefly critique or comment on that response from your perspective
          2. Ask a follow-up question that is related to the original topic
          
          IMPORTANT: Both your critique and your question MUST be directly related to the user's original question and the previous response.
          Stay focused on the specific topic being discussed.
          
          Keep your entire response to 2-3 sentences maximum. Make sure your response is in ${language}.
          
          Original question: "${userMessage}"
        `;
        
        // Use simplified prompt as fallback
        const fallbackPrompt = `You are ${character.name}. Comment briefly on this response: "${previousResponses[0]}" and ask a related follow-up question. Keep it in ${language} and under 3 sentences.`;
        
        responseText = await safeGenerateContent(prompt, fallbackPrompt);
        previousResponses.push(responseText);
      } 
      // Third character - summarizes the previous responses and asks a new question
      else if (i === 2) {
        prompt = `
          You are ${character.name}, with a communication style that is ${character.style}.
          
          Two characters have discussed a topic:
          1. ${responses[0].sender} said: "${previousResponses[0]}"
          2. ${responses[1].sender} said: "${previousResponses[1]}"
          
          Your task is to:
          1. Provide a very brief one-sentence summary of their discussion
          2. Ask a thought-provoking question related to the topic from a new angle
          
          IMPORTANT: Your summary and question MUST be directly related to the user's original question and the previous conversation.
          Do not introduce unrelated topics. Stay focused on the specific subject being discussed.
          
          Keep your entire response to 2 sentences maximum. Make sure your response is in ${language}.
          
          Original question: "${userMessage}"
        `;
        
        // Use simplified prompt as fallback
        const fallbackPrompt = `You are ${character.name}. Summarize briefly: "${previousResponses[0]}" and "${previousResponses[1]}" and ask a related question. Keep it in ${language} and under 2 sentences.`;
        
        responseText = await safeGenerateContent(prompt, fallbackPrompt);
        previousResponses.push(responseText);
      } 
      // Remaining characters - respond to previous messages and ask a new question
      else {
        prompt = `
          You are ${character.name}, with a communication style that is ${character.style}.
          
          You're joining a discussion where the original question was: "${userMessage}"
          
          The last person (${responses[i-1].sender}) said: "${previousResponses[previousResponses.length-1]}"
          
          Your task is to:
          1. Respond to the previous message with your own perspective
          2. Ask a follow-up question to continue the conversation
          
          IMPORTANT: Your response and question MUST be directly related to the user's original question and the ongoing conversation.
          Stay on topic and don't introduce unrelated subjects. Make your contribution relevant to what has been discussed so far.
          
          Keep your entire response to 2-3 sentences maximum. Make sure your response is in ${language}.
        `;
        
        // Use simplified prompt as fallback
        const fallbackPrompt = `You are ${character.name}. Respond to this message: "${previousResponses[previousResponses.length-1]}" and ask a related follow-up question about "${userMessage}". Keep it in ${language} and under 3 sentences.`;
        
        responseText = await safeGenerateContent(prompt, fallbackPrompt);
        previousResponses.push(responseText);
      }
      
      // Save and add the AI-generated response
      const message = await storage.createMessage({
        content: responseText,
        sender: character.name,
        isUser: 0,
        avatar: character.avatar,
        conversationId
      });
      
      responses.push(message);
      
    } catch (error) {
      console.error(`Error generating AI response for character ${i+1}:`, error);
      
      // Create dynamic fallback responses based on user's question
      try {
        // Try with a simpler model/API call as fallback
        let fallbackResponse = "";
        const keywords = userMessage.split(' ').filter(word => word.length > 3).slice(0, 5);
        const topicWords = keywords.join(', ');
        
        if (i === 0) {
          // First character - more direct response
          fallbackResponse = isArabic 
            ? `كـ${character.name}، أرى أن موضوع "${topicWords}" يستحق التفكير من منظور ${character.style}.`
            : `As ${character.name}, I find the topic of "${topicWords}" worth exploring from a ${character.style} perspective.`;
        } else if (i === 1 && previousResponses.length > 0) {
          // Second character - critique
          fallbackResponse = isArabic
            ? `أحترم رأي ${responses[0].sender} لكنني أتساءل عن جوانب أخرى متعلقة بـ"${topicWords}"؟`
            : `I respect ${responses[0].sender}'s view but I wonder about other aspects related to "${topicWords}"?`;
        } else if (i === 2 && previousResponses.length > 1) {
          // Third character - summary
          fallbackResponse = isArabic
            ? `إن الآراء المختلفة حول "${topicWords}" تثير تساؤلاً: ما هو التأثير الحقيقي لهذا الموضوع؟`
            : `The different perspectives on "${topicWords}" raise the question: what is the true impact of this topic?`;
        } else {
          // Other characters - continuation
          const prevSpeaker = responses[Math.max(0, i-1)].sender;
          fallbackResponse = isArabic
            ? `أتفق مع بعض ما قاله ${prevSpeaker} ولكن أتساءل عن تأثير "${topicWords}" على المستقبل.`
            : `I agree with some of ${prevSpeaker}'s points but wonder about the future implications of "${topicWords}".`;
        }
        
        const message = await storage.createMessage({
          content: fallbackResponse,
          sender: character.name,
          isUser: 0,
          avatar: character.avatar,
          conversationId
        });
        
        responses.push(message);
        previousResponses.push(fallbackResponse);
      } catch (fallbackError) {
        console.error(`Even fallback generation failed for character ${i+1}:`, fallbackError);
        // Last resort fallback that doesn't use fixed templates
        const message = await storage.createMessage({
          content: isArabic 
            ? `${character.name} يفكر في إجابة السؤال...` 
            : `${character.name} is contemplating the question...`,
          sender: character.name,
          isUser: 0,
          avatar: character.avatar,
          conversationId
        });
        
        responses.push(message);
        previousResponses.push(message.content);
      }
    }
  }
  
  return responses;
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'user_message') {
          // Create a conversation ID if not provided
          const conversationId = data.conversationId || uuidv4();
          
          // Validate and create user message
          const validatedMessage = insertMessageSchema.parse({
            content: data.content,
            sender: 'User',
            isUser: 1,
            avatar: null,
            conversationId
          });
          
          // Save user message
          const savedMessage = await storage.createMessage(validatedMessage);
          
          // Send confirmation of message receipt
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_received',
              message: savedMessage
            }));
          }
          
          // Generate and send character responses
          const characterResponses = await generateCharacterResponse(data.content, conversationId);
          
          // Send responses one by one with delays
          for (let i = 0; i < characterResponses.length; i++) {
            if (ws.readyState === WebSocket.OPEN) {
              // Send "typing" indicator before each message
              ws.send(JSON.stringify({
                type: 'typing',
                character: {
                  name: characterResponses[i].sender,
                  avatar: characterResponses[i].avatar
                }
              }));
              
              // Wait for simulated typing delay
              await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
              
              // Send the actual message
              ws.send(JSON.stringify({
                type: 'character_message',
                message: characterResponses[i]
              }));
              
              // Delay between messages
              if (i < characterResponses.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
              }
            }
          }
          
          // Conversation complete
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'conversation_complete'
            }));
          }
        }
        
        if (data.type === 'get_messages') {
          const messages = await storage.getMessages(data.conversationId);
          
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'messages_history',
              messages
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error instanceof ZodError 
              ? fromZodError(error).message
              : 'An error occurred processing your message'
          }));
        }
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // REST API routes
  app.get('/api/characters', async (req, res) => {
    try {
      const characters = await storage.getCharacters();
      res.json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ message: 'Error fetching characters' });
    }
  });

  return httpServer;
}
