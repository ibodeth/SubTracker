interface ExchangeRatesResponse {
    base: string;
    date: string;
    rates: Record<string, number>;
}

export const fetchExchangeRates = async (base = 'USD'): Promise<Record<string, number> | null> => {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data: ExchangeRatesResponse = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
};
