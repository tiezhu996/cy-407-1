import { createRouter, createWebHistory } from 'vue-router';
import Gallery from '@/pages/Gallery.vue';
import ArtifactDetail from '@/pages/ArtifactDetail.vue';
import ExhibitionManage from '@/pages/ExhibitionManage.vue';
import ExhibitionHot from '@/pages/ExhibitionHot.vue';
import TourEditor from '@/pages/TourEditor.vue';
import ArtifactManage from '@/pages/ArtifactManage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/exhibitions/exhibition-heritage-hall'
    },
    {
      path: '/exhibitions/:id',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/artifacts/:id',
      name: 'artifact-detail',
      component: ArtifactDetail
    },
    {
      path: '/manage/exhibitions',
      name: 'exhibition-manage',
      component: ExhibitionManage
    },
    {
      path: '/manage/hot',
      name: 'exhibition-hot',
      component: ExhibitionHot
    },
    {
      path: '/manage/tours/:id',
      name: 'tour-editor',
      component: TourEditor
    },
    {
      path: '/manage/artifacts',
      name: 'artifact-manage',
      component: ArtifactManage
    }
  ],
  scrollBehavior: () => ({ top: 0 })
});

export default router;
