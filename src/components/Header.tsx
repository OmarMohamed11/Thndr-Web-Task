import { SearchBar } from "./SearchBar";
import Logo from "../assets/logo.svg";

interface HeaderProps {
    readonly onSearch: (searchTerm: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
    return (
        <header
            className={`w-full py-6 px-4 sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm`}
        >
            <div className="container mx-auto relative flex items-center">
                <div className="flex items-center">
                    <img src={Logo} alt="Nasdaq" className="h-8 w-auto" />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="max-w-md w-full">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>
            </div>
        </header>
    );
}
