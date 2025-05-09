import {
  users, type User, type InsertUser,
  teams, type Team, type InsertTeam,
  players, type Player, type InsertPlayer,
  alliances, type Alliance, type InsertAlliance,
  serverEvents, type ServerEvent, type InsertServerEvent, 
  chatMessages, type ChatMessage, type InsertChatMessage,
  EventType
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Team methods
  getAllTeams(): Promise<Team[]>;
  getTeamById(id: number): Promise<Team | undefined>;
  getTeamByPrefix(prefix: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<boolean>;

  // Player methods
  getAllPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayerByName(name: string): Promise<Player | undefined>;
  getPlayersByTeamId(teamId: number): Promise<Player[]>;
  getOnlinePlayers(): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, data: Partial<InsertPlayer>): Promise<Player | undefined>;
  updatePlayerOnlineStatus(name: string, isOnline: boolean): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;

  // Alliance methods
  getAllAlliances(): Promise<Alliance[]>;
  getAllianceById(id: number): Promise<Alliance | undefined>;
  getAllianceByTeams(team1Id: number, team2Id: number): Promise<Alliance | undefined>;
  createAlliance(alliance: InsertAlliance): Promise<Alliance>;
  deleteAlliance(id: number): Promise<boolean>;
  deleteAllianceByTeams(team1Id: number, team2Id: number): Promise<boolean>;

  // Server Event methods
  getAllEvents(limit?: number): Promise<ServerEvent[]>;
  getEventById(id: number): Promise<ServerEvent | undefined>;
  createEvent(event: InsertServerEvent): Promise<ServerEvent>;
  
  // Chat methods
  getAllChatMessages(limit?: number): Promise<ChatMessage[]>;
  getChatMessageById(id: number): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private players: Map<number, Player>;
  private alliances: Map<number, Alliance>;
  private serverEvents: Map<number, ServerEvent>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userId: number;
  private teamId: number;
  private playerId: number;
  private allianceId: number;
  private eventId: number;
  private chatId: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.players = new Map();
    this.alliances = new Map();
    this.serverEvents = new Map();
    this.chatMessages = new Map();
    
    this.userId = 1;
    this.teamId = 1;
    this.playerId = 1;
    this.allianceId = 1;
    this.eventId = 1;
    this.chatId = 1;
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
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamByPrefix(prefix: string): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(
      (team) => team.prefix === prefix,
    );
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.teamId++;
    const team: Team = { ...insertTeam, id };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: number, data: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;
    
    const updatedTeam: Team = { ...team, ...data };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByName(name: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.name === name,
    );
  }

  async getPlayersByTeamId(teamId: number): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.teamId === teamId,
    );
  }

  async getOnlinePlayers(): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.isOnline,
    );
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.playerId++;
    const now = new Date();
    const player: Player = { ...insertPlayer, id, lastSeen: now };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: number, data: Partial<InsertPlayer>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;
    
    const updatedPlayer: Player = { ...player, ...data };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async updatePlayerOnlineStatus(name: string, isOnline: boolean): Promise<Player | undefined> {
    const player = Array.from(this.players.values()).find(
      (player) => player.name === name,
    );
    
    if (!player) return undefined;
    
    const now = new Date();
    const updatedPlayer: Player = { 
      ...player, 
      isOnline,
      lastSeen: now
    };
    
    this.players.set(player.id, updatedPlayer);
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    return this.players.delete(id);
  }

  // Alliance methods
  async getAllAlliances(): Promise<Alliance[]> {
    return Array.from(this.alliances.values());
  }

  async getAllianceById(id: number): Promise<Alliance | undefined> {
    return this.alliances.get(id);
  }

  async getAllianceByTeams(team1Id: number, team2Id: number): Promise<Alliance | undefined> {
    return Array.from(this.alliances.values()).find(
      (alliance) => 
        (alliance.team1Id === team1Id && alliance.team2Id === team2Id) ||
        (alliance.team1Id === team2Id && alliance.team2Id === team1Id)
    );
  }

  async createAlliance(insertAlliance: InsertAlliance): Promise<Alliance> {
    const id = this.allianceId++;
    const now = new Date();
    const alliance: Alliance = { ...insertAlliance, id, createdAt: now };
    this.alliances.set(id, alliance);
    return alliance;
  }

  async deleteAlliance(id: number): Promise<boolean> {
    return this.alliances.delete(id);
  }

  async deleteAllianceByTeams(team1Id: number, team2Id: number): Promise<boolean> {
    const alliance = await this.getAllianceByTeams(team1Id, team2Id);
    if (!alliance) return false;
    
    return this.alliances.delete(alliance.id);
  }

  // Server Event methods
  async getAllEvents(limit: number = 50): Promise<ServerEvent[]> {
    return Array.from(this.serverEvents.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getEventById(id: number): Promise<ServerEvent | undefined> {
    return this.serverEvents.get(id);
  }

  async createEvent(insertEvent: InsertServerEvent): Promise<ServerEvent> {
    const id = this.eventId++;
    const now = new Date();
    const event: ServerEvent = { ...insertEvent, id, timestamp: now };
    this.serverEvents.set(id, event);
    return event;
  }

  // Chat methods
  async getAllChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getChatMessageById(id: number): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatId++;
    const now = new Date();
    const message: ChatMessage = { ...insertMessage, id, timestamp: now };
    this.chatMessages.set(id, message);
    return message;
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage instead of MemStorage for persistent storage
export const storage = new DatabaseStorage();
