// Using simple dots for now, but you can use HeroIcons here later
export const AmenityList = ({ items }: { items: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {items.map((item) => (
      <div key={item} className="flex items-center gap-3 text-slate-600">
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-light">{item}</span>
      </div>
    ))}
  </div>
);