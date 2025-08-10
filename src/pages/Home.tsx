import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col min-h-screen justify-center items-center space-y-4">
        <h1 className="text-3xl text-center">
          This is the Home Page of the Digital Competency Assessment Frontend
          project
        </h1>
        <div>
          <Button>View Detail</Button>
        </div>
      </main>
    </div>
  );
}
