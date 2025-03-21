import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication (if needed)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or character name
  isUser: integer("is_user").notNull(), // 1 for user messages, 0 for character messages
  avatar: text("avatar"), // URL to avatar image (for characters)
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  conversationId: text("conversation_id").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  sender: true,
  isUser: true,
  avatar: true,
  conversationId: true,
});

// Character schema
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  style: text("style").notNull(), // Personality style for the character
});

export const insertCharacterSchema = createInsertSchema(characters).pick({
  name: true,
  avatar: true,
  style: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
