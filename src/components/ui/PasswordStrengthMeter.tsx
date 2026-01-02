import { checkPasswordStrength, type PasswordStrength } from '@/utils/passwordStrength';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const strengthColors: Record<PasswordStrength['score'], string> = {
  0: 'bg-red-500',
  1: 'bg-orange-500',
  2: 'bg-yellow-500',
  3: 'bg-lime-500',
  4: 'bg-green-500',
};

const strengthBarWidths: Record<PasswordStrength['score'], string> = {
  0: 'w-1/5',
  1: 'w-2/5',
  2: 'w-3/5',
  3: 'w-4/5',
  4: 'w-full',
};

export function PasswordStrengthMeter({ 
  password, 
  showRequirements = true,
  className 
}: PasswordStrengthMeterProps) {
  const strength = checkPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-300',
              strengthColors[strength.score],
              strengthBarWidths[strength.score]
            )}
          />
        </div>
        <p className={cn(
          'text-xs font-heading uppercase tracking-wider',
          strength.score <= 1 ? 'text-red-600' : 
          strength.score === 2 ? 'text-yellow-600' : 
          'text-green-600'
        )}>
          {strength.label}
        </p>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-1 text-xs font-body">
          <RequirementItem 
            met={strength.requirements.minLength} 
            label="12+ characters" 
          />
          <RequirementItem 
            met={strength.requirements.hasUppercase} 
            label="Uppercase letter" 
          />
          <RequirementItem 
            met={strength.requirements.hasLowercase} 
            label="Lowercase letter" 
          />
          <RequirementItem 
            met={strength.requirements.hasNumber} 
            label="Number" 
          />
          <RequirementItem 
            met={strength.requirements.hasSpecial} 
            label="Special character" 
          />
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={cn(
      'flex items-center gap-1',
      met ? 'text-green-600' : 'text-ink/40'
    )}>
      {met ? (
        <Check className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      <span>{label}</span>
    </div>
  );
}
