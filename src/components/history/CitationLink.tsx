import { ExternalLink } from 'lucide-react';

export interface Citation {
  id: number;
  authors: string;
  year: string;
  title: string;
  publication: string;
  doi?: string;
  url?: string;
}

export function CitationLink({ citation }: { citation: Citation }) {
  return (
    <li className="font-body text-muted-foreground text-sm leading-relaxed flex">
      <span className="font-semibold text-foreground flex-shrink-0 w-8">[{citation.id}]</span>
      <span>
        {citation.authors} ({citation.year}). "{citation.title}." <em>{citation.publication}</em>.
        {citation.doi && (
          <span className="block mt-1">
            <a
              href={`https://doi.org/${citation.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
            >
              DOI: {citation.doi}
              <ExternalLink className="w-3 h-3" />
            </a>
          </span>
        )}
        {citation.url && (
          <span className="block mt-1">
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
            >
              View Source
              <ExternalLink className="w-3 h-3" />
            </a>
          </span>
        )}
      </span>
    </li>
  );
}
