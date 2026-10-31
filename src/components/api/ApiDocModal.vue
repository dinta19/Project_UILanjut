<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  rawJsonData: { type: [Object, Array], default: null },
});
defineEmits(["close"]);
const dialog = ref(null);
const activeTab = ref("spec");
const copyStatus = ref("");
let copyTimer;
const formattedJson = computed(() =>
  props.rawJsonData
    ? JSON.stringify(props.rawJsonData, null, 2)
    : "No data has been fetched yet. Load the feed to inspect the response.",
);
const schema = JSON.stringify(
  [
    {
      id: 4773500,
      title: "Community story",
      description: "A short description",
      readable_publish_date: "Sep 29",
      url: "https://dev.to/...",
      cover_image: "https://...",
      tag_list: ["meetup", "community"],
      positive_reactions_count: 14,
      reading_time_minutes: 5,
      user: {
        name: "Author name",
        username: "username",
        profile_image: "https://...",
      },
    },
  ],
  null,
  2,
);
watch(
  () => props.isOpen,
  async (open) => {
    await nextTick();
    if (!dialog.value) return;
    if (open && !dialog.value.open) dialog.value.showModal();
    else if (!open && dialog.value.open) dialog.value.close();
  },
  { immediate: true },
);
const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value);
    copyStatus.value = "Copied";
  } catch {
    copyStatus.value = "Select the JSON to copy manually";
  }
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copyStatus.value = ""), 2500);
};
onBeforeUnmount(() => clearTimeout(copyTimer));
</script>
<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="api-dialog"
      aria-labelledby="api-doc-title"
      @close="$emit('close')"
      @click="(event) => event.target === dialog && dialog.close()"
    >
      <div class="dialog-content">
        <header class="modal-header">
          <div>
            <span class="eyebrow">UNDER THE HOOD</span>
            <h2 id="api-doc-title">Feed data &amp; documentation</h2>
            <p>A closer look at the APIs behind the community feed.</p>
          </div>
          <button
            class="close-button"
            aria-label="Close documentation"
            @click="dialog.close()"
          >
            <AppIcon name="close" />
          </button>
        </header>
        <div class="doc-tabs" role="group" aria-label="Documentation sections">
          <button
            v-for="tab in [
              { id: 'spec', label: 'Endpoints' },
              { id: 'schema', label: 'JSON structure' },
              { id: 'raw', label: 'Live response' },
            ]"
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            :aria-pressed="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="modal-body">
          <div v-if="activeTab === 'spec'">
            <h3>DEV Community</h3>
            <p>
              Public articles from the developer community. These are stories
              and discussions; availability of event registration depends on the
              original author.
            </p>
            <div class="endpoint">
              <span>GET</span
              ><code
                >https://dev.to/api/articles?tag=meetup&amp;per_page=12</code
              >
            </div>
            <div class="table-wrap">
              <table>
                <tbody>
                  <tr>
                    <th scope="row">Authentication</th>
                    <td>No API key required</td>
                  </tr>
                  <tr>
                    <th scope="row">Query parameters</th>
                    <td>
                      <code>tag</code> selects a topic;
                      <code>per_page</code> limits the response to 12 articles.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Response</th>
                    <td>
                      An array of article objects, including title, description,
                      tags, cover image, and author.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3 class="second-heading">DummyJSON</h3>
            <p>Mock posts for exploring loading, search, and error states.</p>
            <div class="endpoint">
              <span>GET</span><code>https://dummyjson.com/posts?limit=12</code>
            </div>
            <p class="response-note">
              Response: <code>{ posts: [ … ], total, skip, limit }</code>. The
              application maps both API responses into a shared card format.
            </p>
          </div>
          <div v-else-if="activeTab === 'schema'">
            <h3>Article response structure</h3>
            <p>
              The feed maps title, description, tags, author, and publication
              date into each story card.
            </p>
            <pre><code>{{schema}}</code></pre>
          </div>
          <div v-else>
            <div class="raw-heading">
              <h3>Latest response</h3>
              <button
                class="button-secondary"
                :disabled="!rawJsonData"
                @click="copyJson"
              >
                <AppIcon name="code" :size="14" />Copy JSON
              </button>
            </div>
            <p role="status">
              {{
                copyStatus ||
                "The complete JSON payload from the latest API request."
              }}
            </p>
            <pre><code>{{formattedJson}}</code></pre>
          </div>
        </div>
        <footer class="modal-footer">
          <span>Public REST APIs · Client-side requests</span
          ><button class="button-primary" @click="dialog.close()">
            Done <AppIcon name="check" :size="16" />
          </button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>
<style scoped>
.api-dialog {
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: min(820px, calc(100% - 32px));
  max-width: none;
  max-height: 86dvh;
  color: var(--text-main);
  background: white;
  box-shadow: 0 24px 80px rgb(28 20 56 / 20%);
}
.api-dialog::backdrop {
  background: rgb(27 23 44 / 45%);
  backdrop-filter: blur(5px);
}
.dialog-content {
  display: flex;
  flex-direction: column;
  max-height: 85dvh;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 27px 30px 22px;
}
.modal-header h2 {
  font-size: 25px;
  letter-spacing: -0.04em;
  margin: 8px 0;
}
.modal-header p {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.close-button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  background: white;
  color: var(--text-muted);
}
.doc-tabs {
  display: flex;
  gap: 20px;
  padding: 0 30px;
  border-bottom: 1px solid var(--border-color);
}
.doc-tabs button {
  padding: 12px 0;
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
  font-size: 12px;
  color: var(--text-muted);
}
.doc-tabs button.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}
.modal-body {
  overflow: auto;
  padding: 27px 30px;
  min-height: 200px;
}
.modal-body h3 {
  font-size: 17px;
  margin-bottom: 10px;
}
.modal-body p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.8;
}
.endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-gray);
  padding: 13px;
  border-radius: 9px;
  margin-bottom: 15px;
  overflow: auto;
  white-space: nowrap;
  font-size: 11px;
}
.endpoint > span {
  background: #e5f0ea;
  color: #42765c;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 4px;
}
.table-wrap {
  overflow: auto;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 11px;
  text-align: left;
}
th,
td {
  padding: 13px 10px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
}
th {
  width: 140px;
  font-weight: 600;
}
td {
  color: var(--text-muted);
}
.second-heading {
  margin-top: 30px;
}
.response-note {
  margin-top: 10px;
}
pre {
  padding: 21px;
  background: #28243b;
  border-radius: 11px;
  color: #ded9ec;
  font-size: 11px;
  line-height: 1.8;
  overflow: auto;
  margin: 15px 0 0;
}
.raw-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.raw-heading h3 {
  margin: 0;
}
.raw-heading button {
  min-height: 32px;
  padding: 6px 10px;
  font-size: 10px;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 17px 30px;
  border-top: 1px solid var(--border-color);
  background: var(--page-bg);
}
.modal-footer > span {
  font-size: 10px;
  color: var(--text-muted);
}
.modal-footer button {
  min-height: 37px;
  padding: 8px 17px;
  font-size: 12px;
}
@media (max-width: 600px) {
  .modal-header {
    padding: 23px 20px 18px;
  }
  .modal-header h2 {
    font-size: 21px;
  }
  .doc-tabs {
    padding-inline: 20px;
    gap: 17px;
  }
  .doc-tabs button {
    font-size: 11px;
  }
  .modal-body {
    padding: 20px;
  }
  .modal-footer {
    padding: 15px 20px;
  }
  .modal-footer > span {
    font-size: 9px;
  }
  th {
    width: 100px;
  }
}
</style>
