import type { ServicePhase } from './siteContent';

type ServiceSection = {
  heading: string;
  body: string;
};

type ServiceBody = {
  problem: string;
  sections: ServiceSection[];
};

export const serviceBody: Record<ServicePhase['id'], ServiceBody> = {
  assessment: {
    problem:
      'Most companies know something is off, but they lack visibility into what, where, and why. Without a clear picture, every dollar spent on technology is a gamble.',
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
  'database-mobilization': {
    problem:
      'When your data is locked inside one platform, you are betting everything on one vendor. If technology shifts, switching costs become painful.',
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
  'ai-implementation': {
    problem:
      'Your team spends hours on work that follows predictable patterns: triage, routing, extraction, follow-ups, and repetitive coordination.',
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
  'personalized-software': {
    problem:
      'Intelligence and automation only matter if people can actually use them. Generic software forces teams to adapt to the tool.',
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
};
