<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  submitted: [];
}>();

const name = ref('');
const email = ref('');
const company = ref('');
const message = ref('');
const website = ref(''); // honeypot

const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        company: company.value.trim() || undefined,
        message: message.value.trim(),
        website: website.value,
      }),
    });

    const data = (await response.json()) as { success?: boolean; error?: string };

    if (!response.ok) {
      error.value =
        data.error ??
        'Something went wrong. Please try again or email us directly at leads@flowmatrixai.com.';
      return;
    }

    emit('submitted');
  } catch {
    error.value =
      'Something went wrong. Please try again or email us directly at leads@flowmatrixai.com.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="lead-form" novalidate @submit.prevent="handleSubmit">
    <!-- Honeypot -->
    <div class="hp-field" aria-hidden="true">
      <label for="lf-website">Website</label>
      <input
        id="lf-website"
        v-model="website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="form-field">
      <label for="lf-name" class="form-label"
        >Name <span class="required" aria-hidden="true">*</span></label
      >
      <input
        id="lf-name"
        v-model="name"
        type="text"
        name="name"
        class="form-input"
        required
        autocomplete="name"
        placeholder="Your name"
        :disabled="loading"
      />
    </div>

    <div class="form-field">
      <label for="lf-email" class="form-label"
        >Email <span class="required" aria-hidden="true">*</span></label
      >
      <input
        id="lf-email"
        v-model="email"
        type="email"
        name="email"
        class="form-input"
        required
        autocomplete="email"
        placeholder="you@company.com"
        :disabled="loading"
      />
    </div>

    <div class="form-field">
      <label for="lf-company" class="form-label"
        >Company <span class="optional">(optional)</span></label
      >
      <input
        id="lf-company"
        v-model="company"
        type="text"
        name="company"
        class="form-input"
        autocomplete="organization"
        placeholder="Your company"
        :disabled="loading"
      />
    </div>

    <div class="form-field">
      <label for="lf-message" class="form-label"
        >What can we help with? <span class="required" aria-hidden="true">*</span></label
      >
      <textarea
        id="lf-message"
        v-model="message"
        name="message"
        class="form-input form-textarea"
        required
        rows="5"
        placeholder="Tell us your current situation and goals."
        :disabled="loading"
      />
    </div>

    <p v-if="error" class="form-error" role="alert">{{ error }}</p>

    <button type="submit" class="form-submit" :disabled="loading">
      {{ loading ? 'Sending…' : 'Send Message' }}
    </button>
  </form>
</template>

<style scoped>
.lead-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Honeypot — visually hidden but accessible to bots */
.hp-field {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  overflow: hidden;
  pointer-events: none;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.required {
  color: var(--color-gold);
  margin-left: 2px;
}

.optional {
  color: var(--color-text-faint);
  font-weight: 400;
}

.form-input {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.6rem 0.85rem;
  transition: border-color 0.18s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--color-text-faint);
}

.form-input:focus {
  border-color: var(--color-gold);
  outline: none;
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-error {
  font-size: 0.875rem;
  color: #f87171;
  margin: 0;
}

.form-submit {
  align-self: flex-start;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-soft));
  border: none;
  border-radius: 999px;
  box-shadow: var(--shadow-gold);
  color: #0b0b0c;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 0.65rem 1.4rem;
  transition: all 0.2s ease;
}

.form-submit:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.form-submit:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
