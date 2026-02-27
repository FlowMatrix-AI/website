<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Button from '../ui/Button.vue';

const route = useRoute();
const mobileOpen = ref(false);
const scrolled = ref(false);

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Results', href: '/#proof' },
  { label: 'Team', href: '/#team' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Free Templates', href: '/free' },
];

const onScroll = () => {
  scrolled.value = window.scrollY > 24;
};

const activeHash = computed(() => route.hash || '');

const isActive = (href: string) => {
  if (href === '/free') {
    return route.path.startsWith('/free');
  }

  if (href.startsWith('/#')) {
    return route.path === '/' && activeHash.value === href.slice(1);
  }

  return route.path === href;
};

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.body.style.overflow = '';
});

watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  }
);
</script>

<template>
  <header class="nav-wrap" :class="{ 'nav-wrap--scrolled': scrolled }">
    <div class="container nav-inner">
      <RouterLink to="/" class="brand-link" aria-label="FlowMatrix AI Home">
        <img src="/flowmatrix-logo.webp" alt="FlowMatrix AI" width="160" height="40" />
      </RouterLink>

      <nav class="nav-desktop" aria-label="Primary">
        <RouterLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="nav-link"
          :class="{ 'is-active': isActive(item.href) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="nav-actions">
        <Button href="/#start" size="md" class="desktop-cta">Start Conversation</Button>
        <button
          class="mobile-toggle"
          type="button"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="visually-hidden">Toggle menu</span>
          <span>{{ mobileOpen ? 'Close' : 'Menu' }}</span>
        </button>
      </div>
    </div>

    <transition name="mobile-fade">
      <div v-if="mobileOpen" id="mobile-menu" class="mobile-panel">
        <nav class="mobile-menu" aria-label="Mobile">
          <RouterLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="mobile-link"
            :class="{ 'is-active': isActive(item.href) }"
          >
            {{ item.label }}
          </RouterLink>
          <Button href="/#start" size="lg" class="animate-pulse-glow">Start Conversation</Button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  inset: 0 0 auto;
  height: var(--nav-height);
  z-index: 20;
  border-bottom: 1px solid transparent;
  transition:
    background 0.22s ease,
    border-color 0.22s ease;
}

.nav-wrap--scrolled {
  background: rgba(5, 5, 5, 0.92);
  backdrop-filter: blur(16px);
  border-color: rgba(255, 255, 255, 0.16);
}

.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.brand-link {
  display: inline-flex;
  align-items: center;
}

.brand-link img {
  width: 132px;
  height: auto;
  filter: saturate(1.03);
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.9), transparent);
  opacity: 0;
  transform: scaleX(0.65);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after,
.nav-link.is-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.nav-link.is-active {
  color: var(--color-gold-soft);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.mobile-toggle {
  display: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.48rem 0.88rem;
  font-size: 0.85rem;
}

.mobile-panel {
  position: fixed;
  inset: var(--nav-height) 0 0;
  background:
    radial-gradient(700px 300px at 82% -10%, rgba(212, 168, 75, 0.14), transparent 64%),
    rgba(5, 5, 5, 0.97);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.mobile-menu {
  padding: var(--space-8) var(--space-6);
  display: grid;
  gap: var(--space-5);
}

.mobile-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.08rem;
  font-weight: 500;
  opacity: 0.9;
}

.mobile-link.is-active {
  color: var(--color-gold-soft);
  opacity: 1;
}

.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
}

@media (max-width: 980px) {
  .desktop-cta,
  .nav-desktop {
    display: none;
  }

  .mobile-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
