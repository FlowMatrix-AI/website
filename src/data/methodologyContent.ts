/**
 * Merged methodology phase data for the MethodologyTabs component.
 * Combines servicePhases (siteContent.ts) + serviceBody (serviceContent.ts) into a
 * single flat structure. The individual source files remain until Sprint 5 cleanup.
 */

export interface MethodologyPhase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  outcomes: string[];
  sections: { heading: string; body: string }[];
}

export const methodologyPhases: MethodologyPhase[] = [
  {
    id: 'assessment',
    phase: 1,
    title: 'Assessment',
    tagline: 'Eliminate the guesswork.',
    description:
      'Before we build anything, we assess. Three tiers of analysis: from a single process audit to a full human-tech holistic review. Every engagement starts here. You walk away with a clear roadmap whether you work with us or not.',
    problem:
      'Most companies know something is off, but they lack visibility into what, where, and why. Without a clear picture, every dollar spent on technology is a gamble.',
    outcomes: [
      'Three tiers, one purpose',
      'What you walk away with',
      'Assessed through an AI lens',
      'Risk reversal',
    ],
    sections: [
      {
        heading: 'Three tiers, one purpose',
        body: 'Tier 1 examines a single workflow. Tier 2 covers your full technology stack and SOPs. Tier 3 adds the human layer: how people actually use the tools and where behavior creates bottlenecks.',
      },
      {
        heading: 'What you walk away with',
        body: 'A written report with executive summary, detailed findings, and prioritized recommendations. Plus a visual working map your team can use to align decisions.',
      },
      {
        heading: 'Assessed through an AI lens',
        body: 'Every finding is evaluated against one question: can AI solve this? Recommendations move from manual process toward intelligent systems.',
      },
      {
        heading: 'Risk reversal',
        body: 'If you proceed with a FlowMatrix build service, the assessment fee is credited as a down payment toward the first month.',
      },
    ],
  },
  {
    id: 'database-mobilization',
    phase: 2,
    title: 'Database Mobilization',
    tagline: 'Bet on the house, not on Red 16.',
    description:
      "We create a living, AI-optimized copy of your company's data that stays in sync with your existing tools. Platform-independent, always current, ready for any AI system to plug into.",
    problem:
      'When your data is locked inside one platform, you are betting everything on one vendor. If technology shifts, switching costs become painful.',
    outcomes: [
      'A parallel intelligence layer',
      'Architecture follows data',
      'Universal access layer',
      'Living sync, not snapshots',
    ],
    sections: [
      {
        heading: 'A parallel intelligence layer',
        body: "We create an AI-optimized copy of your company's data that syncs with source systems in real time. This is not a hard migration, it is a living intelligence layer.",
      },
      {
        heading: 'Architecture follows data',
        body: 'Database design follows data shape: vector databases for unstructured retrieval, graph or relational structures where relationships matter, and hybrids where needed.',
      },
      {
        heading: 'Universal access layer',
        body: 'Data is accessible via structured query interfaces plus semantic retrieval so AI systems can perform precise lookups and contextual reasoning.',
      },
      {
        heading: 'Living sync, not snapshots',
        body: 'Updates in your source systems propagate continuously. The intelligence layer reflects current business state, not stale exports.',
      },
    ],
  },
  {
    id: 'ai-implementation',
    phase: 3,
    title: 'AI Implementation',
    tagline: 'Intelligence that works while you sleep.',
    description:
      'From simple automations to autonomous agents, we build backend systems that eliminate manual work. Automations, AI-powered workflows, agentic systems, and development infrastructure all connected to your mobilized data.',
    problem:
      'Your team spends hours on work that follows predictable patterns: triage, routing, extraction, follow-ups, and repetitive coordination.',
    outcomes: [
      'Automations and workflows',
      'AI-powered workflows',
      'Agentic systems',
      'Development infrastructure',
    ],
    sections: [
      {
        heading: 'Automations and workflows',
        body: 'Scheduled reporting, sync jobs, approvals, and triggered actions remove repetitive manual coordination.',
      },
      {
        heading: 'AI-powered workflows',
        body: 'Document extraction, content classification, meeting summaries, routing decisions, and enrichment tasks become systemized.',
      },
      {
        heading: 'Agentic systems',
        body: 'Autonomous multi-step systems can monitor operations, gather intelligence, and execute routine corrective actions.',
      },
      {
        heading: 'Development infrastructure',
        body: 'We implement the model/tooling stack inside your environment so your team can own and evolve capabilities over time.',
      },
    ],
  },
  {
    id: 'personalized-software',
    phase: 4,
    title: 'Personalized Software',
    tagline: 'Where intelligence meets interface.',
    description:
      'Custom applications designed for how your people actually work, powered by your own data, with AI woven into every interaction.',
    problem:
      'Intelligence and automation only matter if people can actually use them. Generic software forces teams to adapt to the tool.',
    outcomes: [
      'Designed for your people',
      'Powered by your data',
      'AI-native by design',
      'Internal, external, or both',
    ],
    sections: [
      {
        heading: 'Designed for your people',
        body: 'Interfaces are shaped around real operator behavior, not generic assumptions about workflows.',
      },
      {
        heading: 'Powered by your data',
        body: 'Dashboards, search experiences, and workflows pull from your mobilized data in real time.',
      },
      {
        heading: 'AI-native by design',
        body: 'Intelligence is embedded into interaction patterns so users receive relevant context and recommendations at the point of decision.',
      },
      {
        heading: 'Internal, external, or both',
        body: 'Executive dashboards, operations workspaces, client portals, and customer-facing tools can share the same intelligence backbone.',
      },
    ],
  },
];
