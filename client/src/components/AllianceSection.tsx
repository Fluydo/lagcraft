import { useQuery } from "@tanstack/react-query";
import { Alliance, Team } from "@shared/schema";
import { useWebSocket } from "@/hooks/useWebSocket";
import { queryClient } from "@/lib/queryClient";

export function AllianceSection() {
  const { data: alliances = [] } = useQuery<Alliance[]>({
    queryKey: ['/api/alliances'],
  });
  
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  // Listen for websocket updates
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'alliance') {
        queryClient.invalidateQueries({ queryKey: ['/api/alliances'] });
      }
    }
  });

  // Get team info by id
  const getTeam = (id: number) => {
    return teams.find(team => team.id === id);
  };

  return (
    <section id="alliances" className="bg-card rounded-lg p-5 border border-[hsl(var(--accent-blue))]/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-2xl flex items-center">
          <i className="ri-sword-line mr-2 text-[hsl(var(--accent-purple))]"></i> Alianças Ativas
        </h2>
        <span className="text-sm text-gray-400 font-tech">{alliances.length} alianças</span>
      </div>
      
      {alliances.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <i className="ri-shield-cross-line text-4xl mb-2"></i>
          <p>Não existem alianças ativas no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alliances.map((alliance) => {
            const team1 = getTeam(alliance.team1Id);
            const team2 = getTeam(alliance.team2Id);
            
            if (!team1 || !team2) return null;
            
            return (
              <div 
                key={alliance.id} 
                className="flex items-center bg-muted rounded-lg border border-[hsl(var(--accent-blue))]/20 p-4 overflow-hidden"
              >
                <div 
                  className="flex-1 text-center" 
                  style={{ 
                    background: `linear-gradient(90deg, rgba(${hexToRgb(team1.color)}, 0.1) 0%, transparent 100%)` 
                  }}
                >
                  <span 
                    className="font-tech font-semibold" 
                    style={{ color: team1.color }}
                  >
                    {team1.name}
                  </span>
                </div>
                <div className="flex-none px-3">
                  <i className="ri-shield-check-line text-xl text-[hsl(var(--accent-purple))]"></i>
                </div>
                <div 
                  className="flex-1 text-center" 
                  style={{ 
                    background: `linear-gradient(90deg, transparent 0%, rgba(${hexToRgb(team2.color)}, 0.1) 100%)` 
                  }}
                >
                  <span 
                    className="font-tech font-semibold" 
                    style={{ color: team2.color }}
                  >
                    {team2.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digits
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }
  
  // Convert hex to rgb
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}
