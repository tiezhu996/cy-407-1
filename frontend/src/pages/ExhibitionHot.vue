<template>
  <section class="manage-page">
    <div class="page-head">
      <div>
        <h1>展览热度榜</h1>
        <p>按浏览次数展示已发布展览，点击可直接进入展厅参观。</p>
      </div>
      <n-tag :bordered="false" type="success">共 {{ exhibitionStore.publishedByHot.length }} 个展览</n-tag>
    </div>

    <div class="manage-grid">
      <section class="exhibition-list">
        <article
          v-for="(item, index) in exhibitionStore.publishedByHot"
          :key="item.id"
          class="hot-card"
          :style="{ '--theme': item.themeColor }"
        >
          <div class="hot-rank" :class="{ 'top-three': index < 3 }">
            <span class="rank-number">{{ index + 1 }}</span>
            <span class="rank-label">{{ rankLabel(index) }}</span>
          </div>
          <div class="hot-content">
            <div class="status-line">
              <span>{{ exhibitionStatusLabels[item.status] }}</span>
              <div class="view-count">
                <span class="view-icon">👁</span>
                <strong>{{ item.viewCount }}</strong>
                <span>次浏览</span>
              </div>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.intro }}</p>
            <footer>
              <span>{{ item.curator }}</span>
              <div>
                <n-button size="small" secondary @click="router.push(`/exhibitions/${item.id}`)">进入展厅</n-button>
              </div>
            </footer>
          </div>
        </article>
        <n-result
          v-if="exhibitionStore.publishedByHot.length === 0"
          status="info"
          title="暂无已发布展览"
          description="请先在展览管理中创建并发布展览。"
        />
      </section>

      <section class="panel-surface info-panel">
        <header>
          <h2>热度说明</h2>
        </header>
        <div class="info-stack">
          <div class="info-block">
            <h4>统计规则</h4>
            <p>每次用户进入 3D 展厅页面时，该展览的浏览次数自动 +1。数据仅在本地存储，不会上传。</p>
          </div>
          <div class="info-block">
            <h4>排序方式</h4>
            <p>左侧榜单按浏览次数从高到低排序，前三名带有特殊标识。</p>
          </div>
          <div class="info-block" v-if="topExhibition">
            <h4>当前榜首</h4>
            <div class="top-card" :style="{ '--theme': topExhibition.themeColor }">
              <h5>{{ topExhibition.title }}</h5>
              <p class="top-intro">{{ topExhibition.intro }}</p>
              <div class="top-meta">
                <n-tag :bordered="false">{{ topExhibition.curator }}</n-tag>
                <span>累计 {{ topExhibition.viewCount }} 次浏览</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useExhibitionStore } from '@/stores/exhibition';
import { exhibitionStatusLabels } from '@/types';

const router = useRouter();
const exhibitionStore = useExhibitionStore();

const topExhibition = computed(() => exhibitionStore.publishedByHot[0]);

function rankLabel(index: number): string {
  if (index === 0) return 'TOP 1';
  if (index === 1) return 'TOP 2';
  if (index === 2) return 'TOP 3';
  return '';
}
</script>

<style scoped>
.manage-page {
  display: grid;
  gap: 18px;
}

.manage-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  gap: 18px;
  align-items: start;
}

.exhibition-list {
  display: grid;
  gap: 14px;
}

.hot-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  padding: 20px;
  background:
    linear-gradient(90deg, var(--theme), var(--theme)) 0 0 / 6px 100% no-repeat,
    #fbf5e8;
  border: 1px solid rgba(23, 63, 53, 0.14);
  border-radius: 8px;
}

.hot-rank {
  display: grid;
  place-items: center;
  gap: 4px;
  width: 60px;
  padding: 10px 0;
  color: rgba(31, 46, 41, 0.45);
}

.hot-rank.top-three {
  color: var(--museum-brass);
  font-weight: 800;
}

.rank-number {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1;
}

.rank-label {
  font-size: 12px;
  letter-spacing: 0.06em;
}

.hot-content {
  display: grid;
  gap: 12px;
  min-height: 140px;
}

.status-line,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-line {
  color: var(--museum-brass);
  font-size: 13px;
  font-weight: 800;
}

.view-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.view-count strong {
  font-size: 16px;
  font-family: var(--font-display);
}

.view-count span {
  font-weight: 500;
  color: rgba(31, 46, 41, 0.55);
}

h3 {
  margin: 0;
  color: var(--museum-ink);
  font-family: var(--font-display);
  font-size: 28px;
  line-height: 1.05;
}

p {
  margin: 0;
  color: rgba(31, 46, 41, 0.7);
  line-height: 1.65;
}

footer {
  align-self: end;
  color: rgba(31, 46, 41, 0.64);
  font-size: 13px;
}

footer div {
  display: flex;
  gap: 8px;
}

.info-panel {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.info-panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-panel h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 30px;
}

.info-stack {
  display: grid;
  gap: 18px;
}

.info-block {
  display: grid;
  gap: 8px;
}

.info-block h4 {
  margin: 0;
  font-size: 14px;
  color: var(--museum-green);
}

.info-block p {
  margin: 0;
  line-height: 1.7;
  color: rgba(31, 46, 41, 0.72);
}

.top-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  background:
    linear-gradient(90deg, var(--theme), var(--theme)) 0 0 / 4px 100% no-repeat,
    rgba(23, 63, 53, 0.06);
  border-radius: 6px;
}

.top-card h5 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--museum-ink);
}

.top-intro {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(31, 46, 41, 0.68);
}

.top-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(31, 46, 41, 0.6);
}

@media (max-width: 1080px) {
  .manage-grid {
    grid-template-columns: 1fr;
  }

  .hot-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .hot-rank {
    width: auto;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 10px;
    padding: 0;
  }
}
</style>
