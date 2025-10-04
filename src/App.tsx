import { useState } from "react";
import Splash from "./components/Splash";
import { Explore } from "./pages/Explore";

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
            <Explore />
        </div>
    );
}

export default App;
