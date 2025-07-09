"use client";

import { useEffect, useState } from "react";
import "../app/globals.css";

interface Rates {
  [key: string]: number;
}

export default function Converter() {
  const [rates, setRates] = useState<Rates>({});
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [nextUpdate, setNextUpdate] = useState<string | null>(null);
  const [lang, setLang] = useState<"ru" | "kz">("ru");

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          setRates(data.rates);
          setLastUpdate(data.time_last_update_utc);
          setNextUpdate(data.time_next_update_utc);
        } else {
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const convert = () => {
    const amt = Number(amount);
    if (isNaN(amt) || !rates[fromCurrency] || !rates[toCurrency]) return;

    const amountInUSD = amt / rates[fromCurrency];
    const convertedAmount = amountInUSD * rates[toCurrency];
    setResult(Number(convertedAmount.toFixed(2)));
  };

  const allowedCurrencies = ["USD", "KZT", "EUR", "CNY", "THB", "TRY", "RUB"];
  const currencyOptions = allowedCurrencies.filter((cur) =>
    rates.hasOwnProperty(cur)
  );

  return (
    <div className="p-5">
      <div className="max-w-xl mx-auto p-6 bg-[#d6c9c958] rounded-2xl shadow-xl text-[black]">
        <h1 className="text-2xl font-bold text-center mb-4">
          {lang === "ru" ? "Конвертер валют 💱" : "Валюта конвертері 💱"}
        </h1>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-md p-2 flex-1"
          />
          <div className="flex flex-col flex-1">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="" disabled hidden>
                {lang === "ru" ? "Из какой" : "Қай валютадан"}
              </option>
              {loading ? (
                <option>Loading...</option>
              ) : (
                currencyOptions.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="" disabled hidden>
                {lang === "ru" ? "В какую" : "Қай валютаға"}
              </option>
              {loading ? (
                <option>Loading...</option>
              ) : (
                currencyOptions.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <button
          onClick={convert}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {lang === "ru" ? "Конвертировать 💱" : "Аудару 💱"}
        </button>

        {result !== null && fromCurrency && toCurrency && (
          <h2 className="mt-4 text-center text-xl font-semibold text-green-600">
            {amount} {fromCurrency} = {result} {toCurrency}
          </h2>
        )}

        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={() => setLang("ru")}
            className={`py-1 px-3 rounded ${
              lang === "ru" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("kz")}
            className={`py-1 px-3 rounded ${
              lang === "kz" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            KZ
          </button>
        </div>

        {lastUpdate && nextUpdate && (
          <div className="mt-4 text-center text-gray-700 text-sm">
            {lang === "ru" ? (
              <>
                <p>Последнее обновление: {lastUpdate}</p>
                <p>Следующее обновление: {nextUpdate}</p>
              </>
            ) : (
              <>
                <p>Соңғы жаңарту: {lastUpdate}</p>
                <p>Келесі жаңарту: {nextUpdate}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
