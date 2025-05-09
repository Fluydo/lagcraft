import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatMessage, Team } from "@shared/schema";
import { useWebSocket } from "@/hooks/useWebSocket";
import { queryClient } from "@/lib/queryClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ChatSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat'],
  });
  
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Listen for websocket updates
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'chat') {
        queryClient.invalidateQueries({ queryKey: ['/api/chat'] });
      }
    }
  });

  // Get team info by id
  const getTeam = (id: number | null) => {
    if (!id) return null;
    return teams.find(team => team.id === id);
  };
  
  // Get player's initial letter for avatar
  const getPlayerInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <section id="chat" className="bg-card rounded-lg border border-[hsl(var(--accent-blue))]/20 flex flex-col h-[500px]">
      <div className="p-4 border-b border-[hsl(var(--accent-blue))]/20">
        <h2 className="font-heading font-bold text-xl flex items-center">
          <i className="ri-chat-3-line mr-2 text-blue-400"></i> Chat do Servidor
        </h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="ri-chat-3-line text-4xl mb-2"></i>
            <p>Nenhuma mensagem recente no chat</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const team = getTeam(message.teamId);
              
              return (
                <div key={message.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-2">
                    <Avatar className="w-8 h-8 rounded overflow-hidden bg-muted flex items-center justify-center">
                      <AvatarFallback className="text-lg">
                        {getPlayerInitial(message.playerName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-semibold" 
                        style={{ color: team ? team.color : 'white' }}
                      >
                        {message.playerName}
                      </span>
                      {team && (
                        <span className="text-xs bg-background/40 px-1.5 py-0.5 rounded text-white/70">
                          {team.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{message.message}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
