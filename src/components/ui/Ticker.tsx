const BRANDS = [
  'MorStudio', 'Maicrosoft', 'FnStudio', 'GreenPixel Studio',
  'VoidForge', 'BlackGlass Studio', 'NeonFrame', 'DarkMint',
  'HexaCore', 'GlassCode', 'NightSignal Studio'
];

export function Ticker() {
  const items = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div className="w-full overflow-hidden border-t border-white/5 bg-black/50 backdrop-blur-sm py-3">
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((brand, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6 text-sm text-gray-600 hover:text-green-500/60 transition-colors duration-300 cursor-default select-none">
            <span className="w-1 h-1 rounded-full bg-green-500/40 inline-block" />
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
