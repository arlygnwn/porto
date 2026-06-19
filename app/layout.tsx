import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Arly | Backend & Infrastructure Engineer",
    description: "Backend engineer focused on building robust server runtimes, understanding network layers, and automating deployment pipelines. Passionate about system stability and DevOps fundamentals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased`}>
        {children}
        </body>
        </html>
    );
}