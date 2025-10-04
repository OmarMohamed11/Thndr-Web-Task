import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Ticker } from "../types/ticker";

interface StockCardProps {
    readonly ticker: Ticker;
}

export function StockCard({ ticker }: StockCardProps) {
    // Trim long company names to a reasonable length
    const trimmedName =
        ticker.name.length > 30
            ? `${ticker.name.substring(0, 30)}...`
            : ticker.name;

    return (
        <Card
            data-testid="stock-card"
            className="group h-full transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-light-blue/5 cursor-pointer bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-light-blue/20 backdrop-blur-sm"
        >
            <CardHeader className="pb-4 pt-6">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <CardTitle
                                className="text-lg font-bold text-white leading-tight"
                                title={ticker.name}
                            >
                                {trimmedName}
                            </CardTitle>
                        </div>
                        <Badge
                            variant="secondary"
                            className="ml-3 bg-light-blue/10 text-light-blue border-light-blue/30 hover:bg-light-blue/20 transition-colors duration-300 font-semibold px-3 py-1 text-sm"
                        >
                            {ticker.ticker}
                        </Badge>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-light-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <div
                                className={`w-2 h-2 rounded-full ${ticker.active ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                            />
                            {ticker.primary_exchange}
                        </span>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
