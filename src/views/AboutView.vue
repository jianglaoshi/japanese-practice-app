<template>
  <div id="app">
    <h1>动词变变变</h1>
    <div v-if="!practiceStarted">
      <label>
        请输入要练习的单词数量：
        <input type="number" v-model.number="practiceCount" />
      </label>
      <div>
        <label>请选择变形形式:</label>
        <div class="checkbox-container">
          <label><input type="checkbox" value="masu" v-model="selectedForms" />ます形</label>
          <label><input type="checkbox" value="te" v-model="selectedForms" />て形</label>
          <label><input type="checkbox" value="ta" v-model="selectedForms" />た形</label>
          <label><input type="checkbox" value="nai" v-model="selectedForms" />ない形</label>
          <label><input type="checkbox" value="imperative" v-model="selectedForms" />命令形</label>
          <label><input type="checkbox" value="volitional" v-model="selectedForms" />意志形</label>
          <label><input type="checkbox" value="potential" v-model="selectedForms" />可能形</label>
          <label><input type="checkbox" value="conditional" v-model="selectedForms" />假定形</label>
          <label><input type="checkbox" value="Passivity" v-model="selectedForms" />被动形</label>
          <label><input type="checkbox" value="Causative" v-model="selectedForms" />使役形</label>
          <label><input type="checkbox" value="Causative2" v-model="selectedForms" />使役被动形</label>
        </div>
      </div>
      <button @click="startPractice" :disabled="practiceCount < 1">开始练习</button>
    </div>
    <VerbFormPractice v-if="verbs.length > 0 && practiceStarted" :verbs="verbs" :practiceCount="practiceCount"
      :selectedForms="selectedForms" @restart="restartPractice" />
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
      practiceCount: 30,
      practiceStarted: false,
      selectedForms: []
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
      console.log(this.selectedForms)
      if (this.practiceCount <= 0 || this.selectedForms.length === 0) {
        alert('请输入有效的练习数量并选择至少一种变形形式');
        return;
      }
      if (this.practiceCount > 0) {
        this.practiceStarted = true;
      }
    },
    restartPractice() {
      this.practiceCount = 30;
      this.practiceStarted = false;
    },
  },
};
</script>

<style>
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-container label {
  width: 15%;
  /* 每行4个 */
  box-sizing: border-box;
  padding: 3px;
}
</style>
