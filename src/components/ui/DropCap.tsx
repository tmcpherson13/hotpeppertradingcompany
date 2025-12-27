import { cn } from '@/lib/utils';

interface DropCapProps {
  children: string;
  className?: string;
}

/**
 * DropCap component - Renders text with an enlarged decorative first letter.
 * Use this for the opening paragraph of content sections to maintain 
 * consistent styling across the site.
 */
export const DropCap = ({ children, className }: DropCapProps) => {
  const firstLetter = children.charAt(0);
  const restOfText = children.slice(1);

  return (
    <p className={cn("font-body leading-relaxed", className)}>
      <span className="float-left text-5xl md:text-6xl font-heading text-primary leading-none mr-3 mt-1">
        {firstLetter}
      </span>
      {restOfText}
    </p>
  );
};
