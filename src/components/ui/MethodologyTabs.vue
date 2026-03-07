<script setup lang="ts">
import { ref } from 'vue';
import type { MethodologyPhase } from '../../data/methodologyContent';

const props = defineProps<{
  phases: MethodologyPhase[];
}>();

const activeId = ref(props.phases[0].id);

function handleTabKey(e: KeyboardEvent) {
  const ids = props.phases.map((p) => p.id);
  const current = ids.indexOf(activeId.value);
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    activeId.value = ids[(current + 1) % ids.length];
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    activeId.value = ids[(current - 1 + ids.length) % ids.length];
  }
}
</script>

<template>
  <div class="methodology-tabs">
    <!-- ── Tab button row (desktop) ── -->
    <div role="tablist" aria-label="Implementation phases" class="tab-list">
      <button
        v-for="phase in phases"
        :id="`tab-${phase.id}`"
        :key="phase.id"
        role="tab"
        :aria-controls="`panel-${phase.id}`"
        :aria-selected="activeId === phase.id"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeId === phase.id }"
        @click="activeId = phase.id"
        @keydown="handleTabKey"
      >
        <span class="tab-num">{{ String(phase.phase).padStart(2, '0') }}</span>
        {{ phase.title }}
      </button>
    </div>

    <!-- ── Tab panels ── -->
    <div class="tab-panels-wrap">
      <div
        v-for="phase in phases"
        :id="`panel-${phase.id}`"
        :key="`panel-${phase.id}`"
        role="tabpanel"
        :aria-labelledby="`tab-${phase.id}`"
        :aria-hidden="activeId !== phase.id ? 'true' : undefined"
        :inert="activeId !== phase.id ? true : undefined"
        class="tab-panel"
        :class="{ 'tab-panel--inactive': activeId !== phase.id }"
      >
        <div class="panel-inner">
          <div class="panel-summary">
            <p class="panel-phase-label">Phase {{ phase.phase }}</p>
            <h3 class="panel-title">{{ phase.title }}</h3>
            <p class="panel-tagline">{{ phase.tagline }}</p>
            <p class="panel-problem">{{ phase.problem }}</p>
          </div>

          <div class="panel-sections">
            <div v-for="section in phase.sections" :key="section.heading" class="panel-section">
              <h4>{{ section.heading }}</h4>
              <p>{{ section.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end tab-panels-wrap -->

    <!-- ── Mobile accordion (< 768px) ── -->
    <div class="mobile-accordion">
      <details v-for="phase in phases" :key="`acc-${phase.id}`" class="accordion-item">
        <summary class="accordion-summary">
          <span class="tab-num">{{ String(phase.phase).padStart(2, '0') }}</span>
          {{ phase.title }}
        </summary>
        <div class="accordion-body">
          <p class="panel-tagline">{{ phase.tagline }}</p>
          <p class="panel-problem">{{ phase.problem }}</p>
          <div class="accordion-sections">
            <div v-for="section in phase.sections" :key="section.heading" class="accordion-section">
              <h4>{{ section.heading }}</h4>
              <p>{{ section.body }}</p>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
/* ── Tab list ── */
.tab-list {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-list::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.18s ease,
    border-color 0.18s ease;
}

.tab-btn:hover {
  color: var(--color-text);
}

.tab-btn--active {
  color: var(--color-text);
  border-bottom-color: var(--color-gold);
}

.tab-num {
  color: var(--color-gold-soft);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.7;
}

.tab-btn--active .tab-num {
  opacity: 1;
}

/* ── Tab panels stacking container ── */
.tab-panels-wrap {
  display: grid;
  margin-top: var(--space-1);
}

.tab-panel {
  grid-area: 1 / 1;
  border: 1px solid var(--color-border);
  border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.034), rgba(255, 255, 255, 0.012));
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

.tab-panel--inactive {
  visibility: hidden;
  pointer-events: none;
}

.tab-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    120deg,
    rgba(212, 168, 75, 0.07),
    transparent 35%,
    transparent 68%,
    rgba(255, 255, 255, 0.025)
  );
}

.panel-inner {
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  grid-template-columns: 34fr 66fr;
  gap: var(--space-10);
  align-items: start;
}

.panel-phase-label {
  margin: 0 0 var(--space-2);
  color: var(--color-gold-soft);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.panel-title {
  margin: 0 0 var(--space-2);
  font-size: clamp(1.3rem, 2.2vw, 1.75rem);
  letter-spacing: -0.01em;
}

.panel-tagline {
  margin: 0 0 var(--space-4);
  color: var(--color-gold-soft);
  font-style: italic;
}

.panel-problem {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ── Sections 2-col grid ── */
.panel-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5) var(--space-6);
  align-content: start;
}

.panel-section h4 {
  margin: 0 0 var(--space-2);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
}

.panel-section p {
  margin: 0;
  font-size: 0.87rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ── Mobile accordion ── */
.mobile-accordion {
  display: none;
}

.accordion-item {
  border-bottom: 1px solid var(--color-border);
}

.accordion-summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
  color: var(--color-text);
}

.accordion-summary::-webkit-details-marker {
  display: none;
}

.accordion-body {
  padding: 0 0 var(--space-6);
}

.accordion-sections {
  margin-top: var(--space-4);
  display: grid;
  gap: var(--space-4);
}

.accordion-section h4 {
  margin: 0 0 var(--space-1);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
}

.accordion-section p {
  margin: 0;
  font-size: 0.87rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ── Responsive ── */
@media (max-width: 1000px) {
  .panel-inner {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .panel-sections {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .tab-list,
  .tab-panel {
    display: none;
  }

  .mobile-accordion {
    display: block;
  }
}
</style>
