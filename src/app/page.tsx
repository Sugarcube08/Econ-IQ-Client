'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#0f766e] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-sm text-[#75777a]">Redirecting...</p>
      </div>
    </div>
  );
}
