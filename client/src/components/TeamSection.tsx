import { useQuery } from "@tanstack/react-query";
import { Player, Team } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";

export function TeamSection() {
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players'],
  });
  
  // Listen for websocket updates
  useWebSocket({
    onMessage: (data) => {
      if (['team', 'player'].includes(data.type)) {
        if (data.type === 'team') {
          queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
        }
        if (data.type === 'player') {
          queryClient.invalidateQueries({ queryKey: ['/api/players'] });
        }
      }
    }
  });

  // Group players by team
  const playersByTeam: Record<number, Player[]> = {};
  players.forEach(player => {
    if (player.teamId) {
      if (!playersByTeam[player.teamId]) {
        playersByTeam[player.teamId] = [];
      }
      playersByTeam[player.teamId].push(player);
    }
  });

  return (
    <section id="teams" className="bg-card rounded-lg p-5 border border-[hsl(var(--accent-blue))]/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-2xl flex items-center">
          <i className="ri-team-line mr-2 text-[hsl(var(--accent-blue))]"></i> Equipes
        </h2>
        <span className="text-sm text-gray-400 font-tech">{teams.length} equipes ativas</span>
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <i className="ri-team-line text-4xl mb-2"></i>
          <p>Não existem equipes registradas no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => {
            const teamPlayers = playersByTeam[team.id] || [];
            
            return (
              <Card key={team.id} className="bg-muted rounded border border-[hsl(var(--accent-blue))]/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 
                    className="font-tech font-semibold text-xl" 
                    style={{ color: team.color }}
                  >
                    {team.name}
                  </h3>
                  <span className="text-sm bg-background/50 px-2 py-1 rounded font-tech">
                    {teamPlayers.length} membros
                  </span>
                </div>
                <div className="space-y-2">
                  {teamPlayers.map((player) => (
                    <div key={player.id} className="flex items-center text-sm">
                      <div 
                        className={`w-2 h-2 rounded-full mr-2 ${player.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                      ></div>
                      <span>{player.name}</span>
                    </div>
                  ))}
                  
                  {teamPlayers.length === 0 && (
                    <div className="text-sm text-gray-400 italic">Sem jogadores</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
