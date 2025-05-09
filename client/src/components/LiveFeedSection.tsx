import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServerEvent, Team } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useWebSocket } from "@/hooks/useWebSocket";
import { queryClient } from "@/lib/queryClient";

export function LiveFeedSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: events = [] } = useQuery<ServerEvent[]>({
    queryKey: ['/api/events'],
  });
  
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);
  
  // Listen for websocket updates
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'event') {
        queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      }
    }
  });

  // Get event border color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'pvp': return '#FF3A5E';
      case 'alliance_created': return '#39FF14';
      case 'alliance_broken': return '#FF3A5E';
      case 'player_joined': return '#FFD600';
      case 'player_left': return '#FF3A5E';
      default: return '#4DEEEA';
    }
  };
  
  // Get event label based on type
  const getEventLabel = (type: string) => {
    switch (type) {
      case 'pvp': return 'PvP';
      case 'alliance_created': return 'Aliança';
      case 'alliance_broken': return 'Aliança';
      case 'player_joined': return 'Entrada';
      case 'player_left': return 'Saída';
      default: return 'Evento';
    }
  };
  
  // Format event time to distance to now
  const formatEventTime = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: ptBR 
    });
  };

  // Find player/team names and highlight them with their team colors
  const highlightNames = (content: string) => {
    let formattedContent = content;
    
    // Replace team names with colored versions
    teams.forEach(team => {
      const regex = new RegExp(`'${team.name}'`, 'g');
      formattedContent = formattedContent.replace(
        regex, 
        `<span style="color: ${team.color}">'${team.name}'</span>`
      );
    });
    
    return { __html: formattedContent };
  };

  return (
    <section id="livefeed" className="bg-card rounded-lg border border-[hsl(var(--accent-blue))]/20 flex flex-col h-[500px]">
      <div className="p-4 border-b border-[hsl(var(--accent-blue))]/20">
        <h2 className="font-heading font-bold text-xl flex items-center">
          <i className="ri-live-line mr-2 text-[hsl(var(--accent-green))]"></i> Live Server Feed
        </h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
      >
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="ri-information-line text-4xl mb-2"></i>
            <p>Não há eventos recentes para exibir</p>
          </div>
        ) : (
          <>
            {events.map((event) => (
              <div 
                key={event.id} 
                className="bg-muted rounded-lg p-3 border-l-4"
                style={{ borderColor: getEventColor(event.type) }}
              >
                <div className="text-xs text-gray-400 flex justify-between mb-1">
                  <span>{getEventLabel(event.type)}</span>
                  <span>{formatEventTime(event.timestamp)}</span>
                </div>
                <p 
                  className="text-sm"
                  dangerouslySetInnerHTML={highlightNames(event.content)}
                ></p>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
