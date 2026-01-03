import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CompassBackProps {
  to?: string;
  className?: string;
}

/**
 * CompassBack - A west-pointing compass rose for navigation back to Trading Post.
 * Features hover animation with rotation and golden glow on the west pointer.
 */
export function CompassBack({ to = '/trading-post', className = '' }: CompassBackProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Link to={to} aria-label="Return to Trading Post">
            <motion.div
              className={`cursor-pointer ${className}`}
              whileHover={{ 
                scale: 1.15,
                rotate: -15,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20 
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                {/* Outer ring */}
                <circle 
                  cx="22" 
                  cy="22" 
                  r="20" 
                  stroke="#5a4a3a" 
                  strokeWidth="1.5" 
                  fill="#f5f0e6"
                  opacity="0.95"
                />
                <circle 
                  cx="22" 
                  cy="22" 
                  r="17" 
                  stroke="#3a2a1a" 
                  strokeWidth="0.5" 
                  fill="none"
                  opacity="0.4"
                />
                
                {/* Cardinal direction markers */}
                {/* North */}
                <text x="22" y="9" textAnchor="middle" fontSize="5" fill="#3a2a1a" fontFamily="serif" opacity="0.6">N</text>
                {/* South */}
                <text x="22" y="39" textAnchor="middle" fontSize="5" fill="#3a2a1a" fontFamily="serif" opacity="0.6">S</text>
                {/* East */}
                <text x="38" y="24" textAnchor="middle" fontSize="5" fill="#3a2a1a" fontFamily="serif" opacity="0.6">E</text>
                {/* West - emphasized */}
                <text x="6" y="24" textAnchor="middle" fontSize="6" fill="#d4a84b" fontFamily="serif" fontWeight="bold">W</text>
                
                {/* Compass star - 4 main points */}
                {/* North pointer */}
                <polygon 
                  points="22,12 24,22 22,20 20,22" 
                  fill="#3a2a1a"
                  opacity="0.7"
                />
                {/* South pointer */}
                <polygon 
                  points="22,32 20,22 22,24 24,22" 
                  fill="#5a4a3a"
                  opacity="0.5"
                />
                {/* East pointer */}
                <polygon 
                  points="32,22 22,24 24,22 22,20" 
                  fill="#5a4a3a"
                  opacity="0.5"
                />
                {/* West pointer - EMPHASIZED with gold */}
                <motion.polygon 
                  points="12,22 22,20 20,22 22,24" 
                  fill="#d4a84b"
                  initial={{ fill: '#d4a84b' }}
                  whileHover={{ fill: '#e5b94c' }}
                />
                
                {/* Center decorative circle */}
                <circle 
                  cx="22" 
                  cy="22" 
                  r="3" 
                  fill="#5a4a3a"
                  opacity="0.8"
                />
                <circle 
                  cx="22" 
                  cy="22" 
                  r="1.5" 
                  fill="#d4a84b"
                />
                
                {/* Arrow indicator pointing west */}
                <path 
                  d="M8 22 L14 19 L14 25 Z" 
                  fill="#d4a84b"
                  stroke="#3a2a1a"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>
          </Link>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-ink/95 text-parchment border-tyrian/40 font-heading text-xs uppercase tracking-wider"
        >
          Return to Trading Post
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
