import VibeSearch from "../components/VibeSearch/VibeSearch";

export default function VibeSearchPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2 text-foreground">
          ✨ Vibe Search
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Describe an aesthetic or mood — we'll find the perfect artisan pieces.
        </p>
        <VibeSearch />
      </div>
    </div>
  );
}