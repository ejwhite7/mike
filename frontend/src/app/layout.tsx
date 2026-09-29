import type { Metadata } from "next";
import { Manrope, DM_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/components/providers";

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

const dmMono = DM_Mono({
    variable: "--font-dm-mono",
    subsets: ["latin"],
    weight: "400",
});

const ebGaramond = EB_Garamond({
    variable: "--font-eb-garamond",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://legal.growthcast.app"),
    title: "GrowthCast Legal | Powered by Mike",
    description:
        "Private AI-powered legal document analysis and contract review for GrowthCast.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        url: "https://legal.growthcast.app",
        siteName: "GrowthCast Legal",
        title: "GrowthCast Legal | Powered by Mike",
        description:
            "Private AI-powered legal document analysis and contract review for GrowthCast.",
        images: [
            {
                url: "/link-image.jpg",
                width: 1200,
                height: 651,
                alt: "GrowthCast Legal, powered by Mike",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "GrowthCast Legal | Powered by Mike",
        description:
            "Private AI-powered legal document analysis and contract review for GrowthCast.",
        images: ["/link-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${manrope.variable} ${dmMono.variable} ${ebGaramond.variable} font-sans antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
