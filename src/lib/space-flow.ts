export const featuredSpace = {
  address: "Persiaran Multimedia, Cyberjaya, Selangor",
  amenities: ["Strong WiFi", "Power Outlets"],
  bestFor: ["Focused", "Research", "Deep Work", "Light Collaboration"],
  category: "Library",
  description:
    "A modern, high-fidelity library designed for deep focus and collaborative academic excellence. Featuring architectural bookshelves and a serene environment, it is the premier choice for students seeking a professional study sanctuary in the heart of Cyberjaya. The space is optimized for prolonged intellectual labor, offering diverse zones for both absolute silence and light peer-to-peer discussions.",
  distance: "1.2 mi",
  hours: "8:00 AM - 10:00 PM",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDs78eUem33JsNYT19zY-Gk-Qo3O5MP3GkCgn40IqMRKbI2yievpR_x1_KbXBSbw6qsY6A-GUC88CZEeBQ4ergPGdPCmm8Qc9Q0w5doeGUtCcbMoN_8PCxJDra7pqCCEsgepf9kX64oPgR2NwpxRYuJSVjEi6Fzn4M4d6SWwM15iUYHbKhNbmt7QDODAteD4ttIvLvY71g38w7vHqpufmsIt-IEUhtBElGUepUGof1E1jxHqyBsjrgAGg",
  interests: ["Study", "Collaborative", "Academic Support"],
  name: "Cyberjaya Community Library",
  rating: "4.8",
  slug: "cyberjaya-community-library",
};

export function spacePath(suffix = "") {
  return `/spaces/${featuredSpace.slug}${suffix}`;
}
