import { Header } from "@/components/Header";
import { ClinicalAssistant } from "@/components/ClinicalAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      <ClinicalAssistant />
    </main>
  );
}
