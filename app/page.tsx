import IntroSection from "@/components/IntroSection";
import EndpointsSection from "@/components/EndpointsSection";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <IntroSection />
        <EndpointsSection />
      </main>
    </div>
  );
}
