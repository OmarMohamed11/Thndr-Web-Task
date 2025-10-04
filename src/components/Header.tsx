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
      <div className="container mx-auto relative flex items-center px-2 sm:px-4">
        <div className="flex items-center">
          <img src={Logo} alt="Nasdaq" className="h-6 w-auto sm:h-8" />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="w-64 sm:w-80 md:w-96 lg:w-[500px] xl:w-[600px]">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
    </header>
  );
}
