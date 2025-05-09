import {
  users, type User, type InsertUser,
  teams, type Team, type InsertTeam,
  players, type Player, type InsertPlayer,
  alliances, type Alliance, type InsertAlliance,
  serverEvents, type ServerEvent, type InsertServerEvent, 
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";
import type { IStorage } from "./storage";

/**
 * PostgreSQL database implementation of the IStorage interface
 */
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamByPrefix(prefix: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.prefix, prefix));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined> {
    const [updatedTeam] = await db
      .update(teams)
      .set(data)
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return result !== undefined;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async getPlayerByName(name: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.name, name));
    return player;
  }

  async getPlayersByTeamId(teamId: number): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamId, teamId));
  }

  async getOnlinePlayers(): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.isOnline, true));
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const now = new Date();
    const [newPlayer] = await db
      .insert(players)
      .values({ ...player, lastSeen: now })
      .returning();
    return newPlayer;
  }

  async updatePlayer(id: number, data: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updatedPlayer] = await db
      .update(players)
      .set(data)
      .where(eq(players.id, id))
      .returning();
    return updatedPlayer;
  }

  async updatePlayerOnlineStatus(name: string, isOnline: boolean): Promise<Player | undefined> {
    const now = new Date();
    const [updatedPlayer] = await db
      .update(players)
      .set({ 
        isOnline,
        lastSeen: now
      })
      .where(eq(players.name, name))
      .returning();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    const result = await db.delete(players).where(eq(players.id, id));
    return result !== undefined;
  }

  // Alliance methods
  async getAllAlliances(): Promise<Alliance[]> {
    return await db.select().from(alliances);
  }

  async getAllianceById(id: number): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.id, id));
    return alliance;
  }

  async getAllianceByTeams(team1Id: number, team2Id: number): Promise<Alliance | undefined> {
    const [alliance] = await db
      .select()
      .from(alliances)
      .where(
        or(
          and(
            eq(alliances.team1Id, team1Id),
            eq(alliances.team2Id, team2Id)
          ),
          and(
            eq(alliances.team1Id, team2Id),
            eq(alliances.team2Id, team1Id)
          )
        )
      );
    return alliance;
  }

  async createAlliance(alliance: InsertAlliance): Promise<Alliance> {
    const [newAlliance] = await db
      .insert(alliances)
      .values(alliance)
      .returning();
    return newAlliance;
  }

  async deleteAlliance(id: number): Promise<boolean> {
    const result = await db.delete(alliances).where(eq(alliances.id, id));
    return result !== undefined;
  }

  async deleteAllianceByTeams(team1Id: number, team2Id: number): Promise<boolean> {
    const alliance = await this.getAllianceByTeams(team1Id, team2Id);
    if (!alliance) return false;
    return this.deleteAlliance(alliance.id);
  }

  // Server Event methods
  async getAllEvents(limit: number = 50): Promise<ServerEvent[]> {
    return await db
      .select()
      .from(serverEvents)
      .orderBy(desc(serverEvents.timestamp))
      .limit(limit);
  }

  async getEventById(id: number): Promise<ServerEvent | undefined> {
    const [event] = await db.select().from(serverEvents).where(eq(serverEvents.id, id));
    return event;
  }

  async createEvent(event: InsertServerEvent): Promise<ServerEvent> {
    const [newEvent] = await db
      .insert(serverEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  // Chat methods
  async getAllChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async getChatMessageById(id: number): Promise<ChatMessage | undefined> {
    const [message] = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return message;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }
}