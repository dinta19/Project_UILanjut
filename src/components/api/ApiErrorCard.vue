<script setup>
import AppIcon from "@/components/ui/AppIcon.vue";
defineProps({ error: { type: Object, required: true } });
defineEmits(["retry"]);
</script>
<template>
  <div class="api-error-card" role="alert">
    <span class="error-icon"><AppIcon name="globe" :size="31" /></span
    ><span class="eyebrow">LET’S TRY THAT AGAIN</span>
    <h3>We couldn’t load the feed.</h3>
    <p>
      The community is still out there. Check your connection and try refreshing
      the feed.
    </p>
    <button class="button-primary" @click="$emit('retry')">
      <AppIcon name="refresh" :size="16" />Try again
    </button>
    <details class="error-details">
      <summary>Connection details</summary>
      <strong>{{ error.title }}</strong>
      <p>{{ error.message }}</p>
      <span v-if="error.code">{{ error.code }}</span
      ><span v-if="error.timestamp"> · {{ error.timestamp }}</span>
    </details>
  </div>
</template>
<style scoped>
.api-error-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 48px 24px;
  text-align: center;
  background: white;
  border: 1px solid #eadfd9;
  border-radius: 18px;
}
.error-icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  border-radius: 20px;
  background: #f6ede7;
  color: #a67c62;
  margin-bottom: 21px;
}
.eyebrow {
  font-size: 9px;
  color: #a67c62;
}
h3 {
  font-size: 26px;
  margin: 12px 0;
}
p {
  color: var(--text-muted);
  font-size: 13px;
  max-width: 390px;
  margin: 0 0 23px;
}
.error-details {
  max-width: 600px;
  width: 100%;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 23px;
}
.error-details summary {
  cursor: pointer;
  margin-bottom: 12px;
}
.error-details p {
  font-family: monospace;
  font-size: 11px;
  overflow-wrap: anywhere;
  max-width: 100%;
  margin: 8px 0;
}
.error-details strong {
  font-weight: 600;
}
</style>
