import Image from "next/image";
import Link from "next/link";

interface SiteLogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    iconClassName?: string;
    animate?: boolean;
    asLink?: boolean;
}

export function SiteLogo({
    size = "md",
    className = "",
    iconClassName = "",
    animate = false,
    asLink = false,
}: SiteLogoProps) {
    const sizeClasses = {
        sm: "w-36",
        md: "w-40",
        lg: "w-[180px]",
        xl: "w-[270px]",
    };
    const viewportClasses = {
        sm: "h-7",
        md: "h-8",
        lg: "h-8",
        xl: "h-12",
    };

    // Match the portal's viewport crop without changing the original asset.
    const logo = (
        <span
            className={`inline-flex shrink-0 flex-col ${sizeClasses[size]} ${
                animate ? "sidebar-fade-in" : ""
            } ${className}`}
        >
            <span
                className={`relative inline-block w-full overflow-hidden align-middle ${viewportClasses[size]} ${iconClassName}`}
            >
                <Image
                    src="/growthcast-wordmark.png"
                    alt="GrowthCast"
                    width={5906}
                    height={2363}
                    sizes={size === "xl" ? "338px" : "225px"}
                    className="absolute left-1/2 top-1/2 h-auto w-[125%] max-w-none -translate-x-1/2 -translate-y-1/2 dark:invert"
                    priority
                />
            </span>
            <span className="mt-0.5 text-right text-[10px] leading-none text-gray-500">
                Legal, powered by Mike
            </span>
        </span>
    );

    if (asLink) {
        return (
            <Link
                href="https://growthcast.app"
                className="inline-flex cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
                {logo}
            </Link>
        );
    }

    return logo;
}
