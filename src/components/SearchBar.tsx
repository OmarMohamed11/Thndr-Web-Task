import { useState, useCallback } from "react";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { debounce } from "../lib/debounce";

interface SearchBarProps {
    readonly onSearch: (searchTerm: string) => void;
    readonly placeholder?: string;
    readonly debounceMs?: number;
}

export function SearchBar({
    onSearch,
    placeholder = "Search stocks...",
    debounceMs = 300,
}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = debounce((term: string) => {
        onSearch(term);
    }, debounceMs);

    const handleInputChange = useCallback(
        (value: string) => {
            setSearchTerm(value);
            debouncedSearch(value);
        },
        [debouncedSearch]
    );

    const handleClear = useCallback(() => {
        setSearchTerm("");
        onSearch("");
    }, [onSearch]);

    return (
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    name="search"
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        handleInputChange(e.target.value);
                    }}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
                {searchTerm && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-700/50"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>
        </div>
    );
}
