<template>
  <PracticePage
    title="日语短句练习"
    listUrl="/short.json"
    dataPrefix="/shorts/"
    inputWidth="500px"
  />
</template>

<script>
import PracticePage from '../components/PracticePage.vue';
export default {
  name: 'ShortPractice',
  components: { PracticePage },
};
</script>
