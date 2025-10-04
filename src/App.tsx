import { useState } from "react";
import Splash from "./components/Splash";
import { Explore } from "./pages/Explore";
import { Toaster } from "./components/ui/toaster";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    if (showSplash) {
        return <Splash onComplete={handleSplashComplete} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
            <div className="relative z-10">
                <Explore />
                <Toaster />
            </div>
        </div>
    );
}

export default App;
