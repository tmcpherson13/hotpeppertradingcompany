import { JourneyCard } from './JourneyCard';
import { CONSORTIUMS, getMainConsortiums, getLastConsortium } from '@/data/consortiums';

interface JourneyGridProps {
  onViewManifest: (consortiumId: string) => void;
}

export function JourneyGrid({ onViewManifest }: JourneyGridProps) {
  const mainConsortiums = getMainConsortiums();
  const lastConsortium = getLastConsortium();

  return (
    <div className="space-y-6">
      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainConsortiums.map((consortium) => (
          <JourneyCard
            key={consortium.consortiumId}
            consortium={consortium}
            onViewManifest={onViewManifest}
          />
        ))}
      </div>
      
      {/* Last item centered */}
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <JourneyCard
            consortium={lastConsortium}
            onViewManifest={onViewManifest}
          />
        </div>
      </div>
    </div>
  );
}
