<script setup>
import { computed, ref } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
const props = defineProps({ item: { type: Object, required: true } });
const isJsonVisible = ref(false);
const imageFailed = ref(false);
const avatarFailed = ref(false);
const formattedRawItem = computed(() =>
  JSON.stringify(props.item.rawItem || props.item, null, 2),
);
const initials = computed(() =>
  props.item.author.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase(),
);
const isDemo = computed(() => props.item.source === "DummyJSON API");
</script>
<template>
  <article class="feed-card">
    <a
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      class="cover-link"
      :aria-label="'Read ' + item.title"
    >
      <div
        class="feed-cover"
        :class="{
          'cover-fallback': !item.coverImage || imageFailed,
          'demo-cover': isDemo,
        }"
      >
        <img
          v-if="item.coverImage && !imageFailed"
          :src="item.coverImage"
          :alt="item.title"
          loading="lazy"
          @error="imageFailed = true"
        />
        <template v-else
          ><span class="cover-orbit"></span
          ><span class="cover-monogram">{{ isDemo ? "{ }" : initials }}</span
          ><span class="fallback-caption">{{
            isDemo ? "COMMUNITY STORIES" : "IDEAS WORTH SHARING"
          }}</span></template
        >
        <span class="cover-category">{{ item.tags?.[0] || "Community" }}</span
        ><span class="cover-arrow"
          ><AppIcon name="diagonal" :size="17"
        /></span></div
    ></a>
    <div class="feed-body">
      <div class="story-meta">
        <span>{{ isDemo ? "Demo post" : "Community story" }}</span
        ><span>{{ item.readingTime }}</span>
      </div>
      <h3>
        <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
          item.title
        }}</a>
      </h3>
      <p class="story-description">{{ item.desc }}</p>
      <div class="story-tags">
        <span v-for="tag in item.tags?.slice(0, 3)" :key="tag">#{{ tag }}</span>
      </div>
      <div class="story-author">
        <img
          v-if="item.author.avatar && !avatarFailed"
          :src="item.author.avatar"
          :alt="item.author.name"
          loading="lazy"
          @error="avatarFailed = true"
        /><span v-else class="avatar-fallback">{{ initials }}</span>
        <div>
          <strong>{{ item.author.name }}</strong
          ><span>{{ isDemo ? "Demo content" : item.date }}</span>
        </div>
        <span class="reaction-count"
          ><AppIcon name="heart" :size="14" />{{ item.reactions }}</span
        >
      </div>
    </div>
    <footer class="story-footer">
      <button
        :aria-expanded="isJsonVisible"
        @click="isJsonVisible = !isJsonVisible"
      >
        <AppIcon name="code" :size="14" />{{
          isJsonVisible ? "Hide JSON" : "View JSON"
        }}</button
      ><a :href="item.url" target="_blank" rel="noopener noreferrer"
        >Read story <AppIcon name="arrow" :size="15"
      /></a>
    </footer>
    <div v-if="isJsonVisible" class="json-preview">
      <div>
        <span class="method-label">GET</span
        ><span :title="item.endpoint">{{ item.endpoint }}</span>
      </div>
      <pre><code>{{formattedRawItem}}</code></pre>
    </div>
  </article>
</template>
<style scoped>
.feed-card {
  min-width: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.25s,
    border-color 0.25s,
    box-shadow 0.25s;
}
.feed-card:hover {
  transform: translateY(-4px);
  border-color: #cfc5ea;
  box-shadow: 0 12px 30px rgb(47 34 89 / 7%);
}
.cover-link {
  display: block;
  text-decoration: none;
}
.feed-cover {
  position: relative;
  aspect-ratio: 1.85;
  background: var(--primary-soft);
  overflow: hidden;
}
.feed-cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s;
}
.feed-card:hover .feed-cover > img {
  transform: scale(1.035);
}
.cover-category {
  position: absolute;
  left: 15px;
  top: 15px;
  background: rgb(255 255 255 / 94%);
  color: var(--text-main);
  font-size: 9px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 5px;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cover-arrow {
  position: absolute;
  bottom: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  background: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: var(--text-main);
  box-shadow: 0 2px 10px rgb(40 30 60 / 8%);
}
.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ede8f7;
  color: #a08cc9;
}
.demo-cover {
  background: #e9eff2;
  color: #83a0af;
}
.cover-monogram {
  font-family: "Manrope", sans-serif;
  font-size: 65px;
  font-weight: 800;
  letter-spacing: -6px;
  transform: rotate(-8deg);
  opacity: 0.7;
}
.cover-orbit {
  position: absolute;
  width: 70%;
  height: 85%;
  border: 1px solid currentColor;
  opacity: 0.25;
  border-radius: 50%;
  transform: rotate(-25deg);
}
.cover-orbit::after {
  content: "";
  position: absolute;
  inset: 15px -20px;
  border: 1px solid currentColor;
  border-radius: 50%;
  transform: rotate(45deg);
}
.fallback-caption {
  position: absolute;
  bottom: 17px;
  left: 17px;
  font-size: 8px;
  letter-spacing: 0.16em;
  font-weight: 700;
}
.feed-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 21px 0;
}
.story-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
  color: var(--text-muted);
  margin-bottom: 11px;
}
.story-meta > span:first-child {
  color: var(--primary);
  font-weight: 600;
}
h3 {
  font-size: 18px;
  line-height: 1.45;
  letter-spacing: -0.035em;
  margin: 0 0 10px;
  min-height: 52px;
}
h3 > a {
  color: var(--text-main);
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
h3 > a:hover {
  color: var(--primary);
}
.story-description {
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.story-tags {
  display: flex;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.story-tags > span {
  font-size: 9px;
  color: #8c859c;
}
.story-author {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 15px 0;
  border-top: 1px solid #f0eef5;
}
.story-author > img,
.avatar-fallback {
  width: 29px;
  height: 29px;
  object-fit: cover;
  border-radius: 50%;
  background: var(--primary-soft);
}
.avatar-fallback {
  display: grid;
  place-items: center;
  font-size: 9px;
  color: var(--primary);
  font-weight: 700;
}
.story-author > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.story-author strong {
  font-size: 10px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.story-author div > span {
  font-size: 9px;
  color: var(--text-muted);
}
.reaction-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #9991a4;
  margin-left: auto;
}
.story-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 21px;
  background: #fdfcfe;
  border-top: 1px solid var(--border-color);
  gap: 10px;
}
.story-footer button,
.story-footer a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  padding: 0;
  background: none;
  border: 0;
}
.story-footer button {
  color: var(--text-muted);
}
.story-footer button:hover {
  color: var(--primary);
}
.json-preview {
  background: #28243b;
  padding: 15px;
  color: #ddd7ed;
}
.json-preview > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 9px;
}
.json-preview > div > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.method-label {
  padding: 2px 5px;
  background: #3a574f;
  color: #bfe6d8;
  border-radius: 3px;
}
.json-preview pre {
  max-height: 240px;
  overflow: auto;
  max-width: 100%;
  font-size: 10px;
  line-height: 1.7;
  margin: 12px 0 0;
}
</style>
