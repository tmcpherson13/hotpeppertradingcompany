# Memory: features/admin/pepper-enrichment-system
Updated: 2026-01-02

A comprehensive Pepper Content Enrichment System is integrated into the Admin panel (/admin). The system uses Firecrawl and Perplexity to gather global web data (descriptions, historical notes, culinary uses) for cultivars, which is then synthesized by Lovable AI (google/gemini-2.5-flash) into an archival, merchant-house editorial voice.

## Components
- **PepperEnrichment.tsx**: Main container with stats, pepper list, and research panel
- **EnrichmentPepperList.tsx**: Searchable catalog showing enrichment status (none/researched/pending/enriched)
- **ResearchPanel.tsx**: Triggers Firecrawl/Perplexity research and AI synthesis
- **EnrichmentReviewModal.tsx**: Side-by-side diff view for admin approval with edit capability
- **EnrichmentStats.tsx**: Dashboard metrics for enrichment progress

## Hooks
- **usePepperResearch.ts**: Manages research data fetching and triggering
- **usePepperEnrichment.ts**: Manages enrichment queue, synthesis, approval/rejection

## Edge Functions
- **pepper-research**: Calls Firecrawl search + Perplexity AI for web research
- **pepper-synthesize**: Uses Lovable AI to synthesize research into merchant-house voice content
- **pepper-apply-enrichment**: Applies approved content to pepper_overrides table

## Database Schema
- **pepper_research**: Stores raw Firecrawl/Perplexity results
- **pepper_enrichment_queue**: Holds AI proposals pending admin review
- **pepper_overrides** (extended): Added flavor_notes, aroma_notes, culinary_uses, source_citations, enrichment_version

## Workflow
1. Admin selects pepper from catalog
2. Clicks "Research Web" to trigger Firecrawl + Perplexity gathering
3. Clicks "Synthesize with AI" to generate enriched content
4. Reviews side-by-side comparison in modal
5. Approves (with optional edits) or rejects proposal
6. Approved content is committed to pepper_overrides
