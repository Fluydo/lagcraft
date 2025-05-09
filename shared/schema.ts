import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables from the original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// LagCraft specific schemas
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  prefix: text("prefix").notNull().unique(),
  color: text("color").notNull(),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  prefix: true,
  color: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  teamId: integer("team_id").references(() => teams.id),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  teamId: true,
  isOnline: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export const alliances = pgTable("alliances", {
  id: serial("id").primaryKey(),
  team1Id: integer("team1_id").notNull().references(() => teams.id),
  team2Id: integer("team2_id").notNull().references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAllianceSchema = createInsertSchema(alliances).pick({
  team1Id: true,
  team2Id: true,
});

export type InsertAlliance = z.infer<typeof insertAllianceSchema>;
export type Alliance = typeof alliances.$inferSelect;

export const eventTypes = ["pvp", "alliance_created", "alliance_broken", "player_joined", "player_left"] as const;
export type EventType = typeof eventTypes[number];

export const serverEvents = pgTable("server_events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertServerEventSchema = createInsertSchema(serverEvents).pick({
  type: true,
  content: true,
});

export type InsertServerEvent = z.infer<typeof insertServerEventSchema>;
export type ServerEvent = typeof serverEvents.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  teamId: integer("team_id").references(() => teams.id),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  playerName: true,
  teamId: true,
  message: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
