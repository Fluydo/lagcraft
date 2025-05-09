import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { useQuery } from "@tanstack/react-query";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: onlinePlayers = [] } = useQuery({
    queryKey: ['/api/players/online'],
    refetchInterval: 5000,
  });
  
  const onlineCount = onlinePlayers.length;

  return (
    <>
      <header className="bg-card border-b border-primary/20 p-4 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-heading font-bold text-2xl md:text-3xl bg-gradient-to-r from-[hsl(var(--accent-green))] via-[hsl(var(--accent-blue))] to-[hsl(var(--accent-purple))] bg-clip-text text-transparent">
              LagCraft
            </h1>
            <div className="ml-6 font-tech text-[hsl(var(--accent-blue))] flex items-center border border-[hsl(var(--accent-blue))]/30 px-3 py-1 rounded">
              <i className="ri-server-line mr-2"></i>
              <span className="select-all">lag-craft.aternos.me</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center text-green-400">
              <div className="h-2 w-2 bg-[hsl(var(--accent-green))] rounded-full pulse-animation mr-2"></div>
              <span className="font-tech">{onlineCount}</span>
              <span className="ml-1 text-gray-400">jogadores online</span>
            </div>
            
            <a 
              href="#" 
              className="font-tech text-sm border border-[hsl(var(--accent-purple))]/50 bg-secondary/50 hover:bg-secondary px-4 py-2 rounded transition-colors"
            >
              <i className="ri-discord-fill mr-1"></i> Discord
            </a>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-2xl"
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </header>
      
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onlineCount={onlineCount}
      />
    </>
  );
}
