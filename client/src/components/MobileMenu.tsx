import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onlineCount: number;
}

export function MobileMenu({ isOpen, onClose, onlineCount }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div 
      className={`md:hidden bg-card fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[hsl(var(--accent-blue))]/20">
          <h2 className="font-heading font-bold text-xl">Menu</h2>
          <button onClick={onClose} className="text-2xl">
            <i className="ri-close-line"></i>
          </button>
        </div>
        
        <nav className="flex flex-col space-y-4 flex-1">
          <a 
            href="#teams" 
            onClick={onClose}
            className="flex items-center p-3 rounded hover:bg-muted transition-colors"
          >
            <i className="ri-team-line mr-3 text-[hsl(var(--accent-purple))]"></i>
            <span>Equipes</span>
          </a>
          <a 
            href="#alliances" 
            onClick={onClose}
            className="flex items-center p-3 rounded hover:bg-muted transition-colors"
          >
            <i className="ri-sword-line mr-3 text-[hsl(var(--accent-purple-light))]"></i>
            <span>Alianças</span>
          </a>
          <a 
            href="#livefeed" 
            onClick={onClose}
            className="flex items-center p-3 rounded hover:bg-muted transition-colors"
          >
            <i className="ri-live-line mr-3 text-[hsl(var(--accent-purple-dark))]"></i>
            <span>Live Feed</span>
          </a>
          <a 
            href="#players" 
            onClick={onClose}
            className="flex items-center p-3 rounded hover:bg-muted transition-colors"
          >
            <i className="ri-user-3-line mr-3 text-purple-300"></i>
            <span>Jogadores Online</span>
          </a>
          <a 
            href="#chat" 
            onClick={onClose}
            className="flex items-center p-3 rounded hover:bg-muted transition-colors"
          >
            <i className="ri-chat-3-line mr-3 text-purple-200"></i>
            <span>Chat do Servidor</span>
          </a>
        </nav>
        
        <div className="pt-4 border-t border-[hsl(var(--accent-purple))]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-purple-400">
              <div className="h-2 w-2 bg-[hsl(var(--accent-purple-light))] rounded-full pulse-animation mr-2"></div>
              <span className="font-tech">{onlineCount}</span>
              <span className="ml-1 text-gray-400">jogadores online</span>
            </div>
            
            <a href="#" className="font-tech text-sm border border-[hsl(var(--accent-purple))]/50 bg-secondary/50 hover:bg-secondary px-4 py-2 rounded transition-colors">
              <i className="ri-discord-fill mr-1"></i> Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
