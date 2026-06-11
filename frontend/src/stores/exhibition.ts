import { defineStore } from 'pinia';
import { exhibitionRepository } from '@/api/storage';
import { ExhibitionStatus, type Exhibition, type ExhibitionDraft } from '@/types';
import { createId } from '@/utils/storage';
import { useArtifactStore } from './artifact';

function createSeedExhibition(artifactIds: string[]): Exhibition {
  const now = new Date().toISOString();
  return {
    id: 'exhibition-heritage-hall',
    title: '手作纹理常设展',
    intro: '围绕陶、绣、漆、竹四类工艺组织展陈，强调材料、手势和纹样的对照关系。',
    curator: '云上工艺馆',
    artifactIds,
    themeColor: '#173f35',
    backgroundMusicUrl: '',
    status: ExhibitionStatus.Published,
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  };
}

function normalizeViewCount(exhibition: Exhibition): Exhibition {
  if (typeof exhibition.viewCount === 'number' && !Number.isNaN(exhibition.viewCount)) {
    return exhibition;
  }
  return { ...exhibition, viewCount: 0, updatedAt: new Date().toISOString() };
}

export const useExhibitionStore = defineStore('exhibition', {
  state: () => ({
    exhibitions: [] as Exhibition[],
    loaded: false
  }),
  getters: {
    getById: (state) => (id: string) => state.exhibitions.find((exhibition) => exhibition.id === id),
    published: (state) => state.exhibitions.filter((exhibition) => exhibition.status === ExhibitionStatus.Published),
    publishedByHot: (state) =>
      [...state.exhibitions]
        .filter((exhibition) => exhibition.status === ExhibitionStatus.Published)
        .map((exhibition) => ({
          ...exhibition,
          viewCount: typeof exhibition.viewCount === 'number' && !Number.isNaN(exhibition.viewCount) ? exhibition.viewCount : 0
        }))
        .sort((a, b) => b.viewCount - a.viewCount)
  },
  actions: {
    async load() {
      const records = await exhibitionRepository.list();
      if (records.length === 0) {
        const artifactStore = useArtifactStore();
        const seed = createSeedExhibition(artifactStore.artifacts.map((artifact) => artifact.id));
        await exhibitionRepository.save(seed);
        this.exhibitions = [seed];
      } else {
        const normalized: Exhibition[] = [];
        const dirty: Exhibition[] = [];
        for (const record of records) {
          const fixed = normalizeViewCount(record as Exhibition);
          normalized.push(fixed);
          if (fixed !== record) {
            dirty.push(fixed);
          }
        }
        for (const item of dirty) {
          await exhibitionRepository.save(item);
        }
        this.exhibitions = normalized;
      }
      this.loaded = true;
    },
    async createExhibition(draft: ExhibitionDraft) {
      const now = new Date().toISOString();
      const exhibition: Exhibition = {
        ...draft,
        viewCount: 0,
        id: createId('exhibition'),
        createdAt: now,
        updatedAt: now
      };
      this.exhibitions.unshift(exhibition);
      await exhibitionRepository.save(exhibition);
      return exhibition;
    },
    async incrementViewCount(id: string) {
      const current = this.getById(id);
      if (!current) return;
      const base = typeof current.viewCount === 'number' && !Number.isNaN(current.viewCount) ? current.viewCount : 0;
      const updated: Exhibition = { ...current, viewCount: base + 1, updatedAt: new Date().toISOString() };
      this.exhibitions = this.exhibitions.map((exhibition) => (exhibition.id === id ? updated : exhibition));
      await exhibitionRepository.save(updated);
    },
    async updateExhibition(id: string, patch: Partial<ExhibitionDraft>) {
      const current = this.getById(id);
      if (!current) return;
      const updated: Exhibition = { ...current, ...patch, updatedAt: new Date().toISOString() };
      this.exhibitions = this.exhibitions.map((exhibition) => (exhibition.id === id ? updated : exhibition));
      await exhibitionRepository.save(updated);
    },
    async deleteExhibition(id: string) {
      this.exhibitions = this.exhibitions.filter((exhibition) => exhibition.id !== id);
      await exhibitionRepository.remove(id);
    },
    async reorderArtifacts(id: string, artifactIds: string[]) {
      await this.updateExhibition(id, { artifactIds });
    },
    async publishExhibition(id: string) {
      await this.updateExhibition(id, { status: ExhibitionStatus.Published });
    },
    async unpublishExhibition(id: string) {
      await this.updateExhibition(id, { status: ExhibitionStatus.Draft });
    }
  }
});
