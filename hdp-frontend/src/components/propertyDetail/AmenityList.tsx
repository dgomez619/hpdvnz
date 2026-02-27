import { useTranslation } from 'react-i18next';
import { 
  Wifi, 
  Wind, 
  Car, 
  Utensils, 
  Waves, 
  Tv, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';

// This helper maps your string keys (from the DB) to actual Components
const getIcon = (key: string) => {
  const icons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="h-5 w-5" />,
    ac: <Wind className="h-5 w-5" />,
    parking: <Car className="h-5 w-5" />,
    kitchen: <Utensils className="h-5 w-5" />,
    pool: <Waves className="h-5 w-5" />,
    tv: <Tv className="h-5 w-5" />,
    workspace: <Briefcase className="h-5 w-5" />,
  };

  // Fallback icon if the key doesn't match
  return icons[key] || <CheckCircle2 className="h-5 w-5" />;
};

export const AmenityList = ({ items }: { items: string[] }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-4 text-slate-700">
          {/* Icon wrapper with a soft color */}
          <div className="text-slate-400">
            {getIcon(item)}
          </div>
          
          {/* Translated label */}
          <span className="font-light text-lg">
            {t(`amenities.${item}`)}
          </span>
        </div>
      ))}
    </div>
  );
};