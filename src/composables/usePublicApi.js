import { ref, computed } from 'vue';

// STATE LEVEL SINGLETON (Module-Level)
const items = ref([]);
const rawJson = ref(null);
const isLoading = ref(false);
const error = ref(null);
const activeSource = ref('devto'); // 'devto' | 'dummyjson'
const activeTag = ref('meetup');
const searchQuery = ref('');

export function usePublicApi() {
  /**
   * 1. Dev.to REST API
   * Endpoint: GET https://dev.to/api/articles?tag={tag}&per_page=12
   * Karakteristik: Public API tanpa API Key, CORS diizinkan, data komunitas tech/meetup/workshop riil.
   */
  const fetchDevToArticles = async (tag = activeTag.value, forceError = false) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (forceError) {
        // Simulasi error untuk pengujian Error State
        throw new Error('SIMULATED_NETWORK_ERROR: Gagal menghubungi server Dev.to API (500 Internal Server Error)');
      }

      const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=12`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      rawJson.value = data;

      // NORMALISASI STRUKTUR JSON: Transform ke struktur data standar yang konsisten
      items.value = data.map((item) => ({
        id: `devto-${item.id}`,
        originalId: item.id,
        title: item.title,
        desc: item.description || 'Tidak ada deskripsi singkat untuk acara/artikel ini.',
        date: item.readable_publish_date || new Date(item.published_at).toLocaleDateString('id-ID'),
        loc: 'Global Tech Community (Online / Dev.to)',
        cat: item.tag_list && item.tag_list.length > 0 ? item.tag_list[0].toUpperCase() : 'MEETUP',
        tags: item.tag_list || [],
        coverImage: item.cover_image || item.social_image || null,
        url: item.url,
        author: {
          name: item.user?.name || 'Community Speaker',
          username: item.user?.username || '',
          avatar: item.user?.profile_image_90 || item.user?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        },
        reactions: item.positive_reactions_count || item.public_reactions_count || 0,
        readingTime: item.reading_time_minutes ? `${item.reading_time_minutes} min read` : 'Free Session',
        source: 'Dev.to API',
        endpoint: url,
        rawItem: {
          id: item.id,
          title: item.title,
          readable_publish_date: item.readable_publish_date,
          tag_list: item.tag_list,
          author_name: item.user?.name,
          source_endpoint: url,
          url: item.url
        }
      }));

    } catch (err) {
      console.error('[REST API Error - Dev.to]:', err);
      error.value = {
        title: 'Gagal Memuat Data dari Dev.to API',
        message: err.message || 'Terjadi kesalahan jaringan atau server tidak merespons.',
        code: err.message.includes('HTTP Error') ? err.message.match(/\d+/)?.[0] || 'HTTP_ERR' : 'FETCH_FAILED',
        timestamp: new Date().toLocaleTimeString('id-ID')
      };
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 2. DummyJSON REST API (Sebagai pembanding/referensi modul)
   * Endpoint: GET https://dummyjson.com/posts?limit=12
   */
  const fetchDummyJsonPosts = async (forceError = false) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (forceError) {
        throw new Error('SIMULATED_NETWORK_ERROR: Gagal menghubungi server DummyJSON API (503 Service Unavailable)');
      }

      const url = 'https://dummyjson.com/posts?limit=12';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      rawJson.value = data;

      // NORMALISASI STRUKTUR JSON DUMMYJSON: posts array
      items.value = (data.posts || []).map((post) => ({
        id: `dummy-${post.id}`,
        originalId: post.id,
        title: post.title,
        desc: post.body,
        date: 'Scheduled 2026',
        loc: 'DummyJSON Cloud Hub',
        cat: post.tags && post.tags.length > 0 ? post.tags[0].toUpperCase() : 'COMMUNITY',
        tags: post.tags || [],
        coverImage: null,
        url: 'https://dummyjson.com',
        author: {
          name: `User #${post.userId}`,
          username: `user_${post.userId}`,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${post.userId}`
        },
        reactions: post.reactions?.likes || 0,
        readingTime: `${post.views || 100} views`,
        source: 'DummyJSON API',
        endpoint: url,
        rawItem: {
          id: post.id,
          title: post.title,
          tags: post.tags,
          reactions: post.reactions,
          userId: post.userId,
          source_endpoint: url
        }
      }));

    } catch (err) {
      console.error('[REST API Error - DummyJSON]:', err);
      error.value = {
        title: 'Gagal Memuat Data dari DummyJSON API',
        message: err.message || 'Terjadi kesalahan saat memanggil DummyJSON.',
        code: err.message.includes('HTTP Error') ? err.message.match(/\d+/)?.[0] || 'HTTP_ERR' : 'FETCH_FAILED',
        timestamp: new Date().toLocaleTimeString('id-ID')
      };
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Universal Fetch Dispatcher
   */
  const loadData = (forceError = false) => {
    if (activeSource.value === 'devto') {
      return fetchDevToArticles(activeTag.value, forceError);
    } else {
      return fetchDummyJsonPosts(forceError);
    }
  };

  /**
   * Ganti API Source (Dev.to vs DummyJSON)
   */
  const setSource = (source) => {
    activeSource.value = source;
    loadData();
  };

  /**
   * Ganti Tag Kategori (khusus Dev.to)
   */
  const setTag = (tag) => {
    activeTag.value = tag;
    if (activeSource.value === 'devto') {
      fetchDevToArticles(tag);
    }
  };

  /**
   * Retry Handler
   */
  const retry = () => {
    loadData(false);
  };

  /**
   * Trigger Simulated Error untuk pengujian Error State
   */
  const triggerErrorSimulation = () => {
    loadData(true);
  };

  // FILTERED ITEMS BERDASARKAN SEARCH
  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) return items.value;
    const q = searchQuery.value.toLowerCase();
    return items.value.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return {
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
    fetchDevToArticles,
    fetchDummyJsonPosts
  };
}
