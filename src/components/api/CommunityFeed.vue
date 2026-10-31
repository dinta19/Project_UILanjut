<script setup>
import { computed, onMounted, ref } from "vue";
import { usePublicApi } from "@/composables/usePublicApi";
import AppIcon from "@/components/ui/AppIcon.vue";
import SearchBar from "@/components/event/SearchBar.vue";
import ApiSkeletonCard from "./ApiSkeletonCard.vue";
import ApiErrorCard from "./ApiErrorCard.vue";
import ApiEventCard from "./ApiEventCard.vue";
import ApiDocModal from "./ApiDocModal.vue";
const {
  items,
  filteredItems,
  rawJson,
  isLoading,
  error,
  activeSource,
  activeTag,
  searchQuery,
  setSource,
  setTag,
  retry,
  triggerErrorSimulation,
  loadData,
} = usePublicApi();
const isDocModalOpen = ref(false);
const tags = [
  { label: "Meetups", value: "meetup" },
  { label: "Workshops", value: "workshop" },
  { label: "Conferences", value: "conference" },
  { label: "Web development", value: "webdev" },
  { label: "Vue.js", value: "vue" },
  { label: "Community", value: "community" },
];
const sourceLabel = computed(() =>
  activeSource.value === "devto" ? "DEV Community" : "DummyJSON",
);
onMounted(() => {
  if (!items.value.length && !error.value && !isLoading.value) loadData();
});
</script>
<template>
  <div class="community-feed">
    <div class="feed-toolbar">
      <div class="source-row">
        <div class="source-switch" role="group" aria-label="Feed source">
          <button
            :class="{ selected: activeSource === 'devto' }"
            :aria-pressed="activeSource === 'devto'"
            @click="activeSource !== 'devto' && setSource('devto')"
          >
            <span class="dev-logo">DEV</span><span>DEV Community</span
            ><small>Public feed</small>
          </button>
          <button
            :class="{ selected: activeSource === 'dummyjson' }"
            :aria-pressed="activeSource === 'dummyjson'"
            @click="activeSource !== 'dummyjson' && setSource('dummyjson')"
          >
            <AppIcon name="layers" :size="17" /><span>DummyJSON</span
            ><small>Demo feed</small>
          </button>
        </div>
        <div class="feed-utilities">
          <button
            class="utility-button"
            :disabled="isLoading"
            @click="retry"
            aria-label="Refresh feed"
          >
            <AppIcon
              name="refresh"
              :size="16"
              :class="{ spinning: isLoading }"
            /><span>Refresh</span>
          </button>
          <details class="developer-tools">
            <summary>
              <AppIcon name="code" :size="16" />API tools
              <AppIcon name="chevron" :size="12" />
            </summary>
            <div class="tools-menu">
              <button @click="isDocModalOpen = true">
                <AppIcon name="code" :size="16" />JSON &amp; documentation</button
              ><button :disabled="isLoading" @click="triggerErrorSimulation">
                <AppIcon name="warning" :size="16" />Simulate error state
              </button>
            </div>
          </details>
        </div>
      </div>
      <div class="filter-row">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search stories, ideas, or topics…"
          label="Search community stories"
        /><span class="source-note"
          ><AppIcon name="globe" :size="15" />From the global community</span
        >
      </div>
      <div v-if="activeSource === 'devto'" class="topic-row">
        <span>Explore topics</span>
        <div role="group" aria-label="Feed topics">
          <button
            v-for="tag in tags"
            :key="tag.value"
            :class="{ active: activeTag === tag.value }"
            :aria-pressed="activeTag === tag.value"
            @click="activeTag !== tag.value && setTag(tag.value)"
          >
            {{ tag.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="results-line" role="status" aria-live="polite">
      <span v-if="isLoading">Finding fresh perspectives…</span
      ><span v-else-if="error">The feed is currently unavailable</span
      ><span v-else
        ><strong>{{ filteredItems.length }}</strong>
        {{ activeSource === "devto" ? "community stories" : "demo posts" }}
        <span class="results-source">from {{ sourceLabel }}</span></span
      ><span class="feed-status" :class="{ unavailable: !!error }"
        ><span></span
        >{{
          isLoading
            ? "Updating"
            : error
              ? "Connection issue"
              : "Fetched from " + sourceLabel
        }}</span
      >
    </div>
    <div :aria-busy="isLoading">
      <div
        v-if="isLoading"
        class="api-grid"
        aria-label="Loading community stories"
      >
        <ApiSkeletonCard v-for="n in 6" :key="n" />
      </div>
      <ApiErrorCard v-else-if="error" :error="error" @retry="retry" />
      <div v-else-if="!filteredItems.length" class="empty-state">
        <span class="empty-icon"><AppIcon name="search" :size="30" /></span>
        <h3>No stories found</h3>
        <p>
          {{
            searchQuery
              ? "Try a different keyword or clear your search to see the full feed."
              : "There are no stories for this topic yet. Try another topic or refresh the feed."
          }}
        </p>
        <button
          class="button-primary"
          @click="searchQuery ? (searchQuery = '') : retry()"
        >
          {{ searchQuery ? "Clear search" : "Refresh feed"
          }}<AppIcon name="arrow" :size="16" />
        </button>
      </div>
      <div v-else class="api-grid">
        <ApiEventCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
    <ApiDocModal
      :is-open="isDocModalOpen"
      :raw-json-data="rawJson"
      @close="isDocModalOpen = false"
    />
  </div>
</template>
<style scoped>
.feed-toolbar {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 17px;
  padding: 20px 23px;
  margin-bottom: 25px;
}
.source-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 19px;
}
.source-switch {
  display: flex;
  gap: 6px;
  padding: 4px;
  background: var(--bg-gray);
  border-radius: 11px;
}
.source-switch > button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: none;
  padding: 9px 13px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}
.source-switch > button.selected {
  background: white;
  border-color: var(--border-color);
  color: var(--text-main);
  box-shadow: 0 2px 4px rgb(38 35 61 / 4%);
}
.source-switch small {
  font-size: 9px;
  font-weight: 500;
  color: var(--text-muted);
}
.dev-logo {
  background: var(--text-main);
  color: #fff;
  padding: 0 4px;
  font-size: 9px;
  border-radius: 3px;
  font-weight: 700;
}
.feed-utilities {
  display: flex;
  align-items: center;
  gap: 10px;
}
.utility-button,
.developer-tools > summary {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: none;
  padding: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  list-style: none;
}
.developer-tools > summary::-webkit-details-marker {
  display: none;
}
.utility-button:hover,
.developer-tools > summary:hover {
  color: var(--primary);
}
.developer-tools {
  position: relative;
}
.tools-menu {
  position: absolute;
  z-index: 5;
  top: calc(100% + 8px);
  right: 0;
  min-width: 230px;
  padding: 7px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.tools-menu button {
  border: 0;
  background: none;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  padding: 12px;
  border-radius: 7px;
  width: 100%;
  font-size: 12px;
  color: var(--text-main);
}
.tools-menu button:hover {
  background: var(--bg-gray);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 25px;
}
.filter-row > .search-bar {
  flex: 1;
}
.source-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}
.topic-row {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 19px;
  padding-top: 17px;
  border-top: 1px solid #f0eef4;
}
.topic-row > span {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}
.topic-row > div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.topic-row button {
  background: none;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 6px 12px;
  color: var(--text-muted);
  font-size: 11px;
}
.topic-row button.active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
}
.topic-row button:hover {
  color: var(--primary);
  border-color: #e4ddf6;
}
.results-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  color: var(--text-muted);
  font-size: 12px;
  min-height: 22px;
}
.results-line strong {
  color: var(--text-main);
}
.results-source {
  margin-left: 4px;
}
.feed-status {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
}
.feed-status > span {
  width: 6px;
  height: 6px;
  background: #629b7b;
  border-radius: 50%;
}
.feed-status.unavailable > span {
  background: #b67863;
}
.api-grid {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 23px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 24px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 18px;
}
.empty-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  background: var(--primary-soft);
  color: var(--primary);
  border-radius: 20px;
  margin-bottom: 20px;
}
.empty-state h3 {
  font-size: 23px;
  margin: 0 0 10px;
}
.empty-state p {
  font-size: 13px;
  max-width: 380px;
  color: var(--text-muted);
  margin: 0 0 23px;
}
.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 1000px) {
  .source-switch small {
    display: none;
  }
  .api-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .source-note {
    display: none;
  }
}
@media (max-width: 650px) {
  .feed-toolbar {
    padding: 15px;
  }
  .source-row {
    flex-wrap: wrap;
  }
  .source-switch {
    width: 100%;
  }
  .source-switch > button {
    flex: 1;
    justify-content: center;
    padding: 9px;
    font-size: 11px;
  }
  .feed-utilities {
    width: 100%;
    justify-content: flex-end;
  }
  .topic-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
  .topic-row button {
    padding: 6px 9px;
  }
  .feed-status {
    display: none;
  }
  .api-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
