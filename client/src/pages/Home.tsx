import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { TeamSection } from "@/components/TeamSection";
import { AllianceSection } from "@/components/AllianceSection";
import { PlayersSection } from "@/components/PlayersSection";
import { LiveFeedSection } from "@/components/LiveFeedSection";
import { ChatSection } from "@/components/ChatSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col minecraft-block-pattern">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 grid-pattern">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <HeroSection />
            <TeamSection />
            <AllianceSection />
            <PlayersSection />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <LiveFeedSection />
            <ChatSection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
