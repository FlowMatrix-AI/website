<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import Button from '../ui/Button.vue';

const emit = defineEmits<{
  submitted: [];
}>();

const name = ref('');
const email = ref('');
const company = ref('');
const message = ref('');
const website = ref(''); // honeypot

const loading = ref(false);
const serverError = ref('');
const submitAttempted = ref(false);
const touched = reactive({ name: false, email: false, message: false });

const errors = computed(() => {
  const e: Record<string, string> = {};
  if (!name.value.trim()) e.name = 'Name is required.';
  if (!email.value.trim()) {
    e.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    e.email = 'Enter a valid email address.';
  }
  if (!message.value.trim()) e.message = 'Please tell us what you need help with.';
  return e;
});

function showError(field: 'name' | 'email' | 'message'): string {
  return touched[field] || submitAttempted.value ? (errors.value[field] ?? '') : '';
}

async function handleSubmit() {
  submitAttempted.value = true;
  serverError.value = '';

  if (Object.keys(errors.value).length > 0) return;

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
      serverError.value =
        data.error ??
        'Something went wrong. Please try again or email us at leads@flowmatrixai.com.';
      return;
    }

    emit('submitted');
  } catch {
    serverError.value =
      'Something went wrong. Please try again or email us at leads@flowmatrixai.com.';
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

    <div class="form-row-pair">
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
          :class="{ 'form-input--error': showError('name') }"
          required
          autocomplete="name"
          placeholder="Your name"
          :disabled="loading"
          @blur="touched.name = true"
        />
        <p v-if="showError('name')" class="field-error" role="alert">{{ showError('name') }}</p>
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
          :class="{ 'form-input--error': showError('email') }"
          required
          autocomplete="email"
          placeholder="you@company.com"
          :disabled="loading"
          @blur="touched.email = true"
        />
        <p v-if="showError('email')" class="field-error" role="alert">{{ showError('email') }}</p>
      </div>
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
        :class="{ 'form-input--error': showError('message') }"
        required
        rows="5"
        placeholder="What are you currently dealing with, and what would a better outcome look like?"
        :disabled="loading"
        @blur="touched.message = true"
      />
      <p v-if="showError('message')" class="field-error" role="alert">{{ showError('message') }}</p>
    </div>

    <p v-if="serverError" class="form-error" role="alert">{{ serverError }}</p>

    <Button type="submit" size="lg" :disabled="loading">
      {{ loading ? 'Sending…' : 'Start the Conversation' }}
    </Button>
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

.form-input--error {
  border-color: #f87171;
}

.field-error {
  font-size: 0.8rem;
  color: #f87171;
  margin: 0;
}

.form-error {
  font-size: 0.875rem;
  color: #f87171;
  margin: 0;
}

@media (min-width: 560px) {
  .form-row-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
}
</style>
