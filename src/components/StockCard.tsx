import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Ticker } from "../types/ticker";

interface StockCardProps {
    ticker: Ticker;
}

export function StockCard({ ticker }: StockCardProps) {
    return (
        <Card className="h-full transition-transform hover:scale-105 cursor-pointer">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-light-blue">
                    {ticker.ticker}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticker.name}
                </p>
            </CardContent>
        </Card>
    );
}
