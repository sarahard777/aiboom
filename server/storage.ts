import { 
  User, InsertUser, 
  Message, InsertMessage, 
  Character, InsertCharacter
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message methods
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Character methods
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  getRandomCharacter(usedIds: number[]): Promise<Character>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private characters: Map<number, Character>;
  private userCurrentId: number;
  private messageCurrentId: number;
  private characterCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.characters = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.characterCurrentId = 1;
    
    // Initialize with predefined characters
    this.initializeCharacters();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Message methods
  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return a.timestamp.getTime() - b.timestamp.getTime();
        }
        return 0;
      });
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const message = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      avatar: insertMessage.avatar === undefined ? null : insertMessage.avatar
    } as Message;
    this.messages.set(id, message);
    return message;
  }
  
  // Character methods
  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }
  
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }
  
  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.characterCurrentId++;
    const character: Character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }
  
  async getRandomCharacter(usedIds: number[] = []): Promise<Character> {
    const availableCharacters = Array.from(this.characters.values())
      .filter(char => !usedIds.includes(char.id));
    
    // If all characters have been used, reset and use any character
    if (availableCharacters.length === 0) {
      availableCharacters.push(...Array.from(this.characters.values()));
    }
    
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    return availableCharacters[randomIndex];
  }
  
  // Initialize predefined characters
  private async initializeCharacters() {
    const characters: InsertCharacter[] = [
      {
        name: "Sherlock Holmes",
        avatar: "https://images.unsplash.com/photo-1564510714747-69c3bc1fab41?auto=format&fit=crop&w=80&h=80",
        style: "analytical and precise"
      },
      {
        name: "Marie Curie",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80",
        style: "scientific and thoughtful"
      },
      {
        name: "William Shakespeare",
        avatar: "https://images.unsplash.com/photo-1579088896050-bf1a5001130d?auto=format&fit=crop&w=80&h=80",
        style: "poetic and eloquent"
      },
      {
        name: "Cleopatra",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&h=80",
        style: "regal and strategic"
      },
      {
        name: "Albert Einstein",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80",
        style: "curious and imaginative"
      },
      {
        name: "Jane Austen",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80",
        style: "witty and observant"
      },
      {
        name: "Leonardo da Vinci",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80",
        style: "innovative and contemplative"
      },
      {
        name: "Amelia Earhart",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&h=80",
        style: "adventurous and determined"
      },
      {
        name: "Nelson Mandela",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80",
        style: "wise and compassionate"
      },
      {
        name: "Frida Kahlo",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80",
        style: "passionate and expressive"
      }
    ];
    
    for (const character of characters) {
      await this.createCharacter(character);
    }
  }
}

export const storage = new MemStorage();
