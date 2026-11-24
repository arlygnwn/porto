import { Outfit } from "next/font/google";
import "./globals.css";
import favicon from "./favicon.png";

const outfit = Outfit({ subsets: ["latin"], display: "swap" });

import type { Metadata } from 'next';

export const metadata: Metadata = {
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
        creator: "@yourtwitterhandle", // Update to actual handle if available
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

import { AppProvider } from '@/providers/AppProvider';
import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <body className={`${outfit.className} bg-zinc-100 text-zinc-900 min-h-screen antialiased`}>
                <AppProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </AppProvider>
            </body>
        </html>
    );
}