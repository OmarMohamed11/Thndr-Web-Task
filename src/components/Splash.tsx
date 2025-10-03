import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";

interface SplashProps {
    onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsVisible(false);
                onComplete();
            }, 300);
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            data-testid="splash-container"
            className={`fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
                isFadingOut ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="flex flex-col items-center space-y-8 animate-fade-in">
                <img
                    src={logo}
                    alt="Nasdaq Logo"
                    className="w-48 h-48 md:w-56 md:h-56"
                />
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Nasdaq Stocks
                    </h1>
                    <p className="text-light-blue text-sm md:text-base">
                        Omar Mohamed -{" "}
                        <a
                            href="https://github.com/OmarMohamed11"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white transition-colors"
                        >
                            @OmarMohamed11
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
