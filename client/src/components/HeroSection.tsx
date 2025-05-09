export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-lg glow">
      <div 
        className="h-60 md:h-80 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-shadow mb-2">
            Bem-vindo ao <span className="text-[hsl(var(--accent-green))]">LagCraft</span>
          </h2>
          <p className="text-lg md:text-xl max-w-lg opacity-90">
            Forme alianças, conquiste territórios e torne-se a equipe mais poderosa do servidor.
          </p>
        </div>
      </div>
    </section>
  );
}
