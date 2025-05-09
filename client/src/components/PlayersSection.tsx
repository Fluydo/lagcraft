import { useQuery } from "@tanstack/react-query";
import { Player, Team } from "@shared/schema";
import { useWebSocket } from "@/hooks/useWebSocket";
import { queryClient } from "@/lib/queryClient";

export function PlayersSection() {
  const { data: onlinePlayers = [] } = useQuery<Player[]>({
    queryKey: ['/api/players/online'],
  });
  
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });
  
  // Listen for websocket updates
  useWebSocket({
    onMessage: (data) => {
      if (data.type === 'player') {
        queryClient.invalidateQueries({ queryKey: ['/api/players/online'] });
      }
    }
  });

  // Group online players by team
  const playersByTeam: Record<number, Player[]> = {};
  
  onlinePlayers.forEach(player => {
    if (player.teamId) {
      if (!playersByTeam[player.teamId]) {
        playersByTeam[player.teamId] = [];
      }
      playersByTeam[player.teamId].push(player);
    }
  });

  // Get team info by id
  const getTeam = (id: number) => {
    return teams.find(team => team.id === id);
  };

  // Get teams with online players
  const teamsWithOnlinePlayers = Object.keys(playersByTeam)
    .map(id => getTeam(parseInt(id)))
    .filter(Boolean) as Team[];

  return (
    <section id="players" className="bg-card rounded-lg p-5 border border-[hsl(var(--accent-blue))]/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-2xl flex items-center">
          <i className="ri-user-3-line mr-2 text-yellow-400"></i> Jogadores Online
        </h2>
        <div className="flex items-center">
          <div className="h-2 w-2 bg-[hsl(var(--accent-green))] rounded-full pulse-animation mr-2"></div>
          <span className="font-tech">{onlinePlayers.length}</span>
          <span className="ml-1 text-gray-400">jogadores</span>
        </div>
      </div>
      
      {onlinePlayers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <i className="ri-user-3-line text-4xl mb-2"></i>
          <p>Nenhum jogador online no momento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teamsWithOnlinePlayers.map((team) => {
            const teamPlayers = playersByTeam[team.id] || [];
            
            return (
              <div key={team.id}>
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: team.color }}
                  ></div>
                  <h3 className="font-tech font-semibold">{team.name}</h3>
                </div>
                <div className="bg-muted rounded-lg p-3 flex flex-wrap gap-2">
                  {teamPlayers.map((player) => (
                    <div 
                      key={player.id} 
                      className="bg-background/50 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
