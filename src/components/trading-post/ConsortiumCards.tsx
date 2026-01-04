import { ConsortiumCard } from './ConsortiumCard';
import { CONSORTIUMS, getMainConsortiums, getLastConsortium } from '@/data/consortiums';

interface ConsortiumCardsProps {
  onViewManifest: (consortiumId: string) => void;
}

export function ConsortiumCards({ onViewManifest }: ConsortiumCardsProps) {
  const mainConsortiums = getMainConsortiums();
  const lastConsortium = getLastConsortium();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainConsortiums.map((consortium, index) => (
          <ConsortiumCard
            key={consortium.consortiumId}
            consortium={consortium}
            onViewManifest={onViewManifest}
            index={index}
          />
        ))}
      </div>
      
      {/* Old Natchez Trace - Centered in its own row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="hidden lg:block" /> {/* Empty spacer for left */}
        <ConsortiumCard
          consortium={lastConsortium}
          onViewManifest={onViewManifest}
          index={CONSORTIUMS.length}
          className="md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3"
        />
        <div className="hidden lg:block" /> {/* Empty spacer for right */}
      </div>
    </>
  );
}
