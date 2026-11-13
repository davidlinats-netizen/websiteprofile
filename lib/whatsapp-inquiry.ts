export type ProjectInquiry = { name: string; project: string; message: string };

export function createWhatsAppInquiry(inquiry: ProjectInquiry, destination: string) {
  const url = new URL(destination || "https://api.whatsapp.com/send?phone=639202783648");
  const text = ["Hi David, I'm " + inquiry.name.trim() + ".", "I'm interested in: " + inquiry.project.trim() + ".", "", inquiry.message.trim()].join("\n");
  url.searchParams.set("text", text);
  return url.toString();
}
