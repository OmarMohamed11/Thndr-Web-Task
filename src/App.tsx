import { useState } from "react";
import Splash from "./components/Splash";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    if (showSplash) {
        return <Splash onComplete={handleSplashComplete} />;
    }

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <h1 className="text-4xl font-bold text-center py-8">
                Nasdaq Stocks
            </h1>
            <p className="text-center text-light-blue">Coming soon...</p>
        </div>
    );
}

export default App;
