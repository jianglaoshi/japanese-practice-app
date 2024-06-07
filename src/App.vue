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
import VerbFormPractice from './components/VerbFormPractice.vue';

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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 22px;
}

p {
  font-size: 22px;
}

label {
  display: block;
  margin: 10px 0;
  font-size: 22px;
}

input {
  margin: 10px 0;
  padding: 5px;
  font-size: 22px;
}

button {
  padding: 10px 20px;
  font-size: 22px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #369d73;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}
</style>
