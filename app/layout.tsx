import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import { AppProvider } from '@/providers/AppProvider';
import ClientLayout from '@/components/ClientLayout';
import "./globals.css";
import favicon from "./favicon.png";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jakarta",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm-sans",
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    preload: false,
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://arly.tigaempat.com"),
    title: "Arly | Backend Developer",
    description: "Backend developer focused on building robust server runtimes, understanding network layers, and automating deployment pipelines. Passionate about system stability and DevOps fundamentals.",
    keywords: ["Backend Developer", "Network Administrator", "DevOps", "Portfolio", "Arly", "Java", "Docker", "Linux", "Cisco", "Python"],
    authors: [{ name: "Arly" }],
    creator: "Arly",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://arly.tigaempat.com/", // Update this to actual domain
        title: "Arly | Backend Developer",
        description: "Backend developer focused on building robust server runtimes, understanding network layers, and automating deployment pipelines.",
        siteName: "Arly's Portfolio",
    },
    twitter: {
        card: "summary_large_image",
        title: "Arly | Backend Developer",
        description: "Backend developer focused on building robust server runtimes, understanding network layers, and automating deployment pipelines.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: favicon.src,
        shortcut: favicon.src,
        apple: favicon.src,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${jakarta.variable} ${dmSans.variable} ${jetbrains.variable} scroll-smooth`} data-scroll-behavior="smooth">
            <body className="font-sans bg-zinc-100 text-zinc-900 min-h-screen antialiased">
                <AppProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </AppProvider>
            </body>
        </html>
    );
}