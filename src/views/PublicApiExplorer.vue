<script setup>
import AppIcon from "@/components/ui/AppIcon.vue";
import CommunityFeed from "@/components/api/CommunityFeed.vue";
</script>
<template>
  <div class="api-explorer-page">
    <header class="feed-page-header">
      <div>
        <span class="eyebrow">IDEAS WITHOUT BORDERS</span>
        <h1>The global community.</h1>
        <p>Fresh ideas, shared experiences, and conversations worth joining.</p>
      </div>
      <span class="header-illustration" aria-hidden="true"
        ><AppIcon name="globe" :size="47" /><span>g.</span></span
      >
    </header>
    <CommunityFeed />
  </div>
</template>
<style scoped>
.feed-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  padding: 6px 0 23px;
  border-bottom: 1px solid var(--border-color);
}
h1 {
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 800;
  margin: 10px 0 12px;
  letter-spacing: -0.05em;
}
p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}
.header-illustration {
  position: relative;
  display: grid;
  place-items: center;
  width: 95px;
  height: 95px;
  background: var(--primary-soft);
  border-radius: 25px;
  color: #9a8bd4;
  transform: rotate(8deg);
  margin-right: 12px;
}
.header-illustration > span {
  position: absolute;
  right: -10px;
  bottom: -5px;
  background: white;
  border: 1px solid var(--border-color);
  padding: 0 8px;
  border-radius: 8px;
  color: var(--primary);
  font-family: "Manrope", sans-serif;
  font-weight: 800;
  font-size: 25px;
  transform: rotate(-8deg);
}
@media (max-width: 650px) {
  .header-illustration {
    display: none;
  }
  .feed-page-header {
    padding-bottom: 20px;
    margin-bottom: 24px;
  }
  p {
    font-size: 13px;
  }
}
</style>
