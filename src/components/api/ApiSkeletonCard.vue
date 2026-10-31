<template>
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-image shimmer"></div>
    <div class="skeleton-body">
      <div class="skeleton-meta">
        <div class="skeleton-badge shimmer"></div>
        <div class="skeleton-tag shimmer"></div>
      </div>
      <div class="skeleton-title shimmer"></div>
      <div class="skeleton-title short shimmer"></div>
      <div class="skeleton-desc shimmer"></div>
      <div class="skeleton-desc shimmer"></div>
      <div class="skeleton-desc short shimmer"></div>
      <div class="skeleton-footer">
        <div class="skeleton-avatar shimmer"></div>
        <div class="skeleton-author shimmer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1.85;
  background: #eaeaea;
}

.skeleton-body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex-grow: 1;
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.skeleton-badge {
  width: 70px;
  height: 22px;
  border-radius: 6px;
  background: #e2e2e7;
}

.skeleton-tag {
  width: 80px;
  height: 18px;
  border-radius: 4px;
  background: #ececf0;
}

.skeleton-title {
  width: 90%;
  height: 22px;
  border-radius: 6px;
  background: #e2e2e7;
}

.skeleton-title.short {
  width: 60%;
}

.skeleton-desc {
  width: 100%;
  height: 14px;
  border-radius: 4px;
  background: #ececf0;
}

.skeleton-desc.short {
  width: 75%;
}

.skeleton-footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid #f1f1f4;
}

.skeleton-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e2e2e7;
}

.skeleton-author {
  width: 110px;
  height: 16px;
  border-radius: 4px;
  background: #ececf0;
}

/* ANIMASI SHIMMER */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.45) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.5s infinite;
  content: "";
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
