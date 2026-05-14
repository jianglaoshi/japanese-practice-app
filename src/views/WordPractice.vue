<template>
  <PracticePage
    title="日语单词练习"
    listUrl="/lessonList.json"
    dataPrefix="/lessons/"
  />
</template>

<script>
import PracticePage from '../components/PracticePage.vue';
export default {
  name: 'WordPractice',
  components: { PracticePage },
};
</script>
