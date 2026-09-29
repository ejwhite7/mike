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
    const landingHref = "/";
    const sizeClasses = {
        sm: "w-24",
        md: "w-28",
        lg: "w-40",
        xl: "w-56",
    };

    const logo = (
        <div
            className={`flex flex-col ${sizeClasses[size]} ${
                animate ? "sidebar-fade-in" : ""
            } ${className}`}
        >
            <Image
                src="/growthcast-wordmark.png"
                alt="GrowthCast"
                width={1000}
                height={400}
                priority
                className={`h-auto w-full dark:invert ${iconClassName}`}
            />
            <span className="mt-0.5 text-right text-[10px] leading-none text-gray-500">
                Legal, powered by Mike
            </span>
        </div>
    );

    if (asLink) {
        return (
            <Link
                href={landingHref}
                className="cursor-pointer hover:opacity-80 transition-opacity"
            >
                {logo}
            </Link>
        );
    }

    return logo;
}
