<template>
  <PracticePage
    title="日语动词练习"
    listUrl="/VerbPractice.json"
    dataPrefix="/Verb/"
  />
</template>

<script>
import PracticePage from '../components/PracticePage.vue';
export default {
  name: 'VerbPractice',
  components: { PracticePage },
};
</script>
