import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the dashboard page
  redirect("/auth/login");

  // This won't be executed due to the redirect
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">Call Center Application</h1>
      </div>
    </main>
  );
} 