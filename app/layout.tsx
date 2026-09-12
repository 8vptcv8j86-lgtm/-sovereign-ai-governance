import type { Metadata } from "next";
import "./globals.css";
import "./trust.css";
import "./mobile.css";
import "./brand.css";
export const metadata:Metadata={title:"Sentinel",description:"Institutional AI governance, execution and evidence control.",other:{"codex-preview":"development"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
