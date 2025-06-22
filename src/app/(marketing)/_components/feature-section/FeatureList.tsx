interface FeatureListProps {
  items: string[];
  color: "emerald" | "blue" | "purple" | "green";
}

export function FeatureList({ items, color }: FeatureListProps) {
  const colorMap = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={`w-2 h-2 ${colorMap[color]} rounded-full`}></div>
          <span className="text-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}
