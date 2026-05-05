import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

import PortfolioIndex from "@/components/portfolio-index";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function Home() {
  return <PortfolioIndex fontClassName={`${instrumentSerif.variable} ${jetBrainsMono.variable}`} />;
}
