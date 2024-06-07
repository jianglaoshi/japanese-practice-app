import Vue from 'vue';
import Router from 'vue-router';
import VerbFormPractice from '../components/VerbFormPractice.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/verb-form-practice',
      name: 'VerbFormPractice',
      component: VerbFormPractice
    }
  ]
});
