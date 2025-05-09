export function Footer() {
  return (
    <footer className="bg-card border-t border-[hsl(var(--accent-blue))]/20 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="font-heading font-bold text-xl bg-gradient-to-r from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] bg-clip-text text-transparent">
              LagCraft
            </h2>
            <p className="text-sm text-gray-400 mt-1">Servidor Minecraft com foco em PvP e Alianças</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="font-tech text-center md:text-right">
              <div className="text-[hsl(var(--accent-blue))]">lag-craft.aternos.me</div>
              <div className="text-xs text-gray-400">IP do Servidor</div>
            </div>
            
            <div className="flex space-x-3 text-2xl">
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--accent-blue))] transition-colors">
                <i className="ri-discord-line"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--accent-blue))] transition-colors">
                <i className="ri-youtube-line"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--accent-blue))] transition-colors">
                <i className="ri-instagram-line"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-[hsl(var(--accent-blue))]/20 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} LagCraft. Não afiliado à Mojang Studios.</p>
        </div>
      </div>
    </footer>
  );
}
