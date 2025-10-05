import { SearchBar } from "./SearchBar";
import Logo from "../assets/logo.svg";

interface HeaderProps {
  readonly onSearch: (searchTerm: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header
      className={`w-full py-4 px-4 sm:py-6 sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm`}
    >
      <div className="container mx-auto relative flex items-center justify-between px-2 sm:px-4">
        <div className="flex items-center flex-shrink-0">
          <img src={Logo} alt="Nasdaq" className="h-6 w-auto sm:h-8" />
        </div>

        <div className="flex-1 flex justify-center px-2 sm:px-4">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>

        <div className="flex-shrink-0 w-6 sm:w-8"></div>
      </div>
    </header>
  );
}
