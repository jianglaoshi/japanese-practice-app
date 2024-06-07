<template>
  <div id="app">
    <h1>Japanese Verb Practice</h1>
    <div v-if="!practiceStarted">
      <label>
        请输入要练习的单词数量：
        <input type="number" v-model.number="practiceCount" />
      </label>
      <button @click="startPractice" :disabled="practiceCount < 1">开始练习</button>
    </div>
    <VerbFormPractice v-if="verbs.length > 0 && practiceStarted" :verbs="verbs" :practiceCount="practiceCount"
      @restart="restartPractice" />
  </div>
</template>

<script>
import VerbFormPractice from '../components/VerbFormPractice.vue';

export default {
  name: 'App',
  components: {
    VerbFormPractice,
  },
  data() {
    return {
      verbs: [],
      practiceCount: 50,
      practiceStarted: false,
    };
  },
  created() {
    fetch('/verbs.txt')
      .then(response => response.text())
      .then(text => {
        const verbsArray = text.split('\n').map(line => {
          const [plainForm, type] = line.trim().split(' ');
          return { plainForm, type };
        });
        this.verbs = verbsArray.filter(verb => verb.plainForm && verb.type);
      });
  },
  methods: {
    startPractice() {
      if (this.practiceCount > 0) {
        this.practiceStarted = true;
      }
    },
    restartPractice() {
      this.practiceCount = 0;
      this.practiceStarted = false;
    },
  },
};
</script>


