import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertTeamSchema, 
  insertPlayerSchema, 
  insertAllianceSchema, 
  insertServerEventSchema, 
  insertChatMessageSchema 
} from "@shared/schema";
import { log } from "./vite";
import { z } from "zod";

// Type for WebSocket messages from the Minecraft server (via Skript)
const minecraftUpdateSchema = z.object({
  type: z.enum(["team", "player", "alliance", "event", "chat"]),
  action: z.enum(["create", "update", "delete"]),
  data: z.record(z.any()),
});

type MinecraftUpdate = z.infer<typeof minecraftUpdateSchema>;

// Store connected clients
const clients: WebSocket[] = [];

// Broadcast to all connected clients
function broadcast(data: any) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    log('WebSocket client connected', 'ws');
    
    // Add client to list
    clients.push(ws);

    // Send initial state to client
    sendInitialState(ws);

    // Handle messages from clients (mainly from Minecraft server via Skript)
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        const validatedData = minecraftUpdateSchema.safeParse(data);
        
        if (!validatedData.success) {
          log(`Invalid WebSocket message: ${validatedData.error}`, 'ws');
          return;
        }
        
        const update = validatedData.data;
        await processMinecraftUpdate(update);
        
        // Broadcast the update to all clients
        broadcast({
          type: update.type,
          action: update.action,
          data: update.data,
        });
        
      } catch (error) {
        log(`Error processing WebSocket message: ${error}`, 'ws');
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      log('WebSocket client disconnected', 'ws');
    });
  });

  // API Routes
  // Teams
  app.get('/api/teams', async (req: Request, res: Response) => {
    const teams = await storage.getAllTeams();
    res.json(teams);
  });

  // Players
  app.get('/api/players', async (req: Request, res: Response) => {
    const players = await storage.getAllPlayers();
    res.json(players);
  });

  app.get('/api/players/online', async (req: Request, res: Response) => {
    const onlinePlayers = await storage.getOnlinePlayers();
    res.json(onlinePlayers);
  });

  // Alliances
  app.get('/api/alliances', async (req: Request, res: Response) => {
    const alliances = await storage.getAllAlliances();
    res.json(alliances);
  });

  // Server Events
  app.get('/api/events', async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const events = await storage.getAllEvents(limit);
    res.json(events);
  });

  // Chat Messages
  app.get('/api/chat', async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const messages = await storage.getAllChatMessages(limit);
    res.json(messages);
  });

  return httpServer;
}

// Process updates from Minecraft Server
async function processMinecraftUpdate(update: MinecraftUpdate) {
  try {
    const { type, action, data } = update;
    
    switch (type) {
      case 'team':
        await handleTeamUpdate(action, data);
        break;
      case 'player':
        await handlePlayerUpdate(action, data);
        break;
      case 'alliance':
        await handleAllianceUpdate(action, data);
        break;
      case 'event':
        await handleEventUpdate(data);
        break;
      case 'chat':
        await handleChatUpdate(data);
        break;
    }
  } catch (error) {
    log(`Error processing Minecraft update: ${error}`, 'ws');
  }
}

async function handleTeamUpdate(action: string, data: any) {
  switch (action) {
    case 'create':
      const validTeam = insertTeamSchema.safeParse(data);
      if (validTeam.success) {
        await storage.createTeam(validTeam.data);
      }
      break;
    case 'update':
      if (data.id) {
        const id = parseInt(data.id);
        delete data.id;
        await storage.updateTeam(id, data);
      }
      break;
    case 'delete':
      if (data.id) {
        await storage.deleteTeam(parseInt(data.id));
      }
      break;
  }
}

async function handlePlayerUpdate(action: string, data: any) {
  switch (action) {
    case 'create':
      const validPlayer = insertPlayerSchema.safeParse(data);
      if (validPlayer.success) {
        await storage.createPlayer(validPlayer.data);
      }
      break;
    case 'update':
      if (data.id) {
        const id = parseInt(data.id);
        delete data.id;
        await storage.updatePlayer(id, data);
      } else if (data.name && data.hasOwnProperty('isOnline')) {
        await storage.updatePlayerOnlineStatus(data.name, data.isOnline);
      }
      break;
    case 'delete':
      if (data.id) {
        await storage.deletePlayer(parseInt(data.id));
      }
      break;
  }
}

async function handleAllianceUpdate(action: string, data: any) {
  switch (action) {
    case 'create':
      const validAlliance = insertAllianceSchema.safeParse(data);
      if (validAlliance.success) {
        await storage.createAlliance(validAlliance.data);
      }
      break;
    case 'delete':
      if (data.id) {
        await storage.deleteAlliance(parseInt(data.id));
      } else if (data.team1Id && data.team2Id) {
        await storage.deleteAllianceByTeams(parseInt(data.team1Id), parseInt(data.team2Id));
      }
      break;
  }
}

async function handleEventUpdate(data: any) {
  const validEvent = insertServerEventSchema.safeParse(data);
  if (validEvent.success) {
    await storage.createEvent(validEvent.data);
  }
}

async function handleChatUpdate(data: any) {
  const validMessage = insertChatMessageSchema.safeParse(data);
  if (validMessage.success) {
    await storage.createChatMessage(validMessage.data);
  }
}

// Send initial data to newly connected client
async function sendInitialState(ws: WebSocket) {
  try {
    const teams = await storage.getAllTeams();
    const players = await storage.getAllPlayers();
    const alliances = await storage.getAllAlliances();
    const events = await storage.getAllEvents(50);
    const chatMessages = await storage.getAllChatMessages(50);
    
    const initialState = {
      type: 'initial_state',
      data: {
        teams,
        players,
        alliances,
        events,
        chatMessages,
      }
    };
    
    ws.send(JSON.stringify(initialState));
  } catch (error) {
    log(`Error sending initial state: ${error}`, 'ws');
  }
}
