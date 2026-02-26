<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'ghost'
type ButtonSize = 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    size?: ButtonSize
    target?: '_self' | '_blank'
    rel?: string
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    target: '_self',
  },
)

const tagName = computed(() => (props.href ? 'a' : 'button'))

const classes = computed(() => {
  return {
    'fm-btn': true,
    'fm-btn--primary': props.variant === 'primary',
    'fm-btn--ghost': props.variant === 'ghost',
    'fm-btn--md': props.size === 'md',
    'fm-btn--lg': props.size === 'lg',
  }
})
</script>

<template>
  <component
    :is="tagName"
    :class="classes"
    :href="href"
    :type="tagName === 'button' ? type : undefined"
    :target="href ? target : undefined"
    :rel="href ? rel : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.fm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.fm-btn--md {
  padding: 0.58rem 1.15rem;
  font-size: 0.92rem;
}

.fm-btn--lg {
  padding: 0.8rem 1.55rem;
  font-size: 1rem;
}

.fm-btn--primary {
  color: #0b0b0c;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-soft));
  box-shadow: var(--shadow-gold);
}

.fm-btn--primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.fm-btn--ghost {
  color: var(--color-text);
  border-color: var(--color-border-strong);
  background: rgba(255, 255, 255, 0.03);
}

.fm-btn--ghost:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-soft);
}
</style>
