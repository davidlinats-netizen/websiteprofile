"use client";

import Image from "next/image";
import { toolLogos, toolCategories } from "@/lib/site-config";
import { ScrollReveal } from "./ScrollReveal";
import { useTheme } from "./ThemeProvider";

export function ToolsMarquee() {
  const { theme } = useTheme();
  return <section id="tools" className="section tools-section" aria-labelledby="tools-heading">
    <div className="container tools-heading"><ScrollReveal><h2 id="tools-heading">Tools I&apos;m using</h2></ScrollReveal></div>
    <div className="container tools-categories">
      {toolCategories.map(category => <div className="tools-category" key={category.id}>
        <h3 id={"tools-" + category.id}>{category.title}</h3>
        <div className="tools-grid" role="list" aria-labelledby={"tools-" + category.id}>
      {toolLogos.filter(tool => tool.category === category.id).map((tool, index) => <div key={tool.file} role="listitem">
        <ScrollReveal delay={(index % 6) * 60}>
          <div className="tool-logo">
            <Image src={`/assets/logos/${theme === "dark" && "darkFile" in tool ? tool.darkFile : tool.file}`} alt="" width={64} height={64} />
            <span className="tool-name">{tool.name}</span>
          </div>
        </ScrollReveal>
      </div>)}
        </div>
      </div>)}
    </div>
  </section>;
}
