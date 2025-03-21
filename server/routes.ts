import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { v4 as uuidv4 } from 'uuid';

// Helper to generate character responses
const generateCharacterResponse = async (userMessage: string, conversationId: string) => {
  // Detect language of user message
  const isArabic = /[\u0600-\u06FF]/.test(userMessage);
  
  // Questions that characters can ask (beyond the initial response)
  const englishFollowUpQuestions = [
    "Have you considered how this perspective might change if viewed through a different historical lens?",
    "Wouldn't it be fascinating to explore how this idea connects to the broader human experience?",
    "Could we perhaps delve deeper into the implications this has for our understanding of ourselves?",
    "Is it possible that we're overlooking a crucial element that might change our interpretation entirely?",
    "What if we approached this question from an entirely different angle?",
    "Do you think future generations will view this matter differently than we do today?",
    "How might our personal biases be influencing our interpretation of this situation?",
    "Shouldn't we consider how cultural context shapes our understanding of this topic?",
    "Could there be a pattern here that connects to other great questions of our time?",
    "What would happen if we challenged our fundamental assumptions about this subject?"
  ];
  
  const arabicFollowUpQuestions = [
    "هل فكرت كيف قد تتغير وجهة النظر هذه إذا نظرنا إليها من منظور تاريخي مختلف؟",
    "أليس من المثير للاهتمام استكشاف كيف ترتبط هذه الفكرة بتجربة الإنسان الأوسع؟",
    "هل يمكننا التعمق أكثر في الآثار التي تترتب على فهمنا لأنفسنا؟",
    "هل من الممكن أننا نغفل عنصراً حاسماً قد يغير تفسيرنا تماماً؟",
    "ماذا لو اقتربنا من هذا السؤال من زاوية مختلفة تماماً؟",
    "هل تعتقد أن الأجيال القادمة ستنظر إلى هذه المسألة بشكل مختلف عما نفعل اليوم؟",
    "كيف يمكن أن تؤثر تحيزاتنا الشخصية على تفسيرنا لهذا الموقف؟",
    "ألا يجب أن نأخذ بعين الاعتبار كيف يشكل السياق الثقافي فهمنا لهذا الموضوع؟",
    "هل يمكن أن يكون هناك نمط يربط هذا بالأسئلة الكبرى الأخرى في عصرنا؟",
    "ماذا سيحدث لو تحدينا افتراضاتنا الأساسية حول هذا الموضوع؟"
  ];
  
  // Select the appropriate follow-up questions based on language
  const followUpQuestions = isArabic ? arabicFollowUpQuestions : englishFollowUpQuestions;

  // First character response templates
  const englishFirstResponseTemplates = [
    "I believe the answer you seek requires thoughtful consideration, wouldn't you agree that understanding comes from multiple perspectives?",
    "Your question is quite intriguing, and I wonder if we might explore it from various angles to arrive at a more complete understanding?",
    "That's a fascinating inquiry which deserves careful analysis - perhaps we should examine the underlying assumptions first?",
    "I've pondered similar questions myself, and I find that the most enriching approach is to consider multiple viewpoints, don't you think?",
    "The answer to your question might not be as straightforward as it seems; have you considered the historical context that shapes our understanding?"
  ];
  
  const arabicFirstResponseTemplates = [
    "أعتقد أن الإجابة التي تبحث عنها تتطلب تفكيراً عميقاً، ألا توافق أن الفهم يأتي من وجهات نظر متعددة؟",
    "سؤالك مثير للاهتمام، وأتساءل ما إذا كان بإمكاننا استكشافه من زوايا مختلفة للوصول إلى فهم أكثر اكتمالاً؟",
    "هذا استفسار رائع يستحق تحليلاً دقيقاً - ربما يجب أن نفحص الافتراضات الأساسية أولاً؟",
    "لقد تأملت في أسئلة مشابهة بنفسي، وأجد أن النهج الأكثر إثراءً هو النظر في وجهات نظر متعددة، ألا تعتقد ذلك؟",
    "قد لا تكون الإجابة على سؤالك بسيطة كما تبدو؛ هل فكرت في السياق التاريخي الذي يشكل فهمنا؟"
  ];
  
  // Select the appropriate first response templates based on language
  const firstResponseTemplates = isArabic ? arabicFirstResponseTemplates : englishFirstResponseTemplates;
  
  // Select a random first response
  const randomFirstResponse = firstResponseTemplates[Math.floor(Math.random() * firstResponseTemplates.length)];
  
  // Get the responses
  const responses = [];
  const usedCharacterIds: number[] = [];

  // Generate 10 character responses
  for (let i = 0; i < 10; i++) {
    const character = await storage.getRandomCharacter(usedCharacterIds);
    usedCharacterIds.push(character.id);
    
    const responseContent = i === 0 
      ? randomFirstResponse 
      : followUpQuestions[i - 1];
    
    const message = await storage.createMessage({
      content: responseContent,
      sender: character.name,
      isUser: 0,
      avatar: character.avatar,
      conversationId
    });
    
    responses.push(message);
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
