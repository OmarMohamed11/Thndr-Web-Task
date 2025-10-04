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
            className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-50 transition-opacity duration-500 backdrop-blur-sm ${
                isFadingOut ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-light-blue/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-light-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex flex-col items-center space-y-8 animate-fade-in relative z-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-light-blue/20 rounded-full blur-3xl group-hover:bg-light-blue/30 transition-all duration-300" />
                    <img
                        src={logo}
                        alt="Nasdaq Logo"
                        className="relative w-48 h-48 md:w-56 md:h-56 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-light-blue bg-clip-text text-transparent">
                        Nasdaq Stocks
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-light-blue/50 to-transparent mx-auto" />
                    <p className="text-slate-300 text-sm md:text-base">
                        Omar Mohamed -{" "}
                        <a
                            href="https://github.com/OmarMohamed11"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-blue hover:text-white transition-colors duration-300 underline decoration-light-blue/50 hover:decoration-white/70"
                        >
                            @OmarMohamed11
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
