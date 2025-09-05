import Navigation from "@/components/Navigation";
import PageTabs from "@/components/PageTabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <PageTabs />
      </main>
    </div>
  );
}
