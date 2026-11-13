import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VideoShowcase } from "@/components/VideoShowcase";
import { Services } from "@/components/Services";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { Contact } from "@/components/Contact";
import { BlueprintBackground } from "@/components/BlueprintBackground";
import { PortfolioAssistant } from "@/components/PortfolioAssistant";

export default function Home() {
  return <><BlueprintBackground /><Header /><main id="main"><Hero /><VideoShowcase /><Services /><ToolsMarquee /><Contact /></main><PortfolioAssistant /></>;
}
