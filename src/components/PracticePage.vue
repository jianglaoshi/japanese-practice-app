<template>
  <div class="practice-page">
    <h1>{{ title }}</h1>

    <!-- 选课阶段 -->
    <div v-if="!isPracticing">
      <p>请选择要练习的课程：</p>
      <div class="lessons-container">
        <label v-for="lesson in sortedLessons" :key="lesson" class="lesson-item">
          <input type="checkbox" :value="lesson" v-model="selectedLessons" />
          {{ lesson }}
        </label>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button @click="startPractice">开始练习</button>
    </div>

    <!-- 练习阶段 -->
    <div v-else>
      <div v-if="!practiceCompleted" class="practice-container">
        <span class="prompt-word">{{ currentWord.chinese }}：</span>
        <input
          v-model="userInput"
          @keypress.enter="checkWord"
          class="word-input"
          :style="{ width: inputWidth }"
          ref="inputRef"
          autofocus
        />
        <p class="feedback" :class="feedbackClass">{{ feedback }}</p>
        <p class="progress">还剩 {{ remainingWords }} 个，正确：{{ correctCount }}</p>
      </div>

      <!-- 结果 -->
      <div v-if="practiceCompleted" class="results-summary">
        <p>练习结束！共 {{ words.length }} 个，正确 {{ correctCount }} 个</p>
        <ul class="wrong-list">
          <li v-for="(word, i) in wrongWords" :key="i">
            {{ word.chinese }} → {{ word.japanese }}
          </li>
        </ul>
        <button @click="copyWrongWords" v-if="wrongWords.length > 0">复制错题</button>
        <button @click="resetPractice" style="margin-left: 10px">重新开始</button>
      </div>

      <!-- 历史记录 -->
      <ul class="scrollable-ul" v-if="!practiceCompleted">
        <li v-for="(word, i) in answeredWords" :key="i">
          {{ word.chinese }}：{{ word.japanese }}
          <span :class="word.correct ? 'correct' : 'wrong'">
            {{ word.correct ? '✓' : '✗' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PracticePage',
  props: {
    title: { type: String, required: true },
    listUrl: { type: String, required: true },   // 课程列表 JSON 的路径
    dataPrefix: { type: String, required: true }, // 词库文件所在目录，如 /lessons/
    inputWidth: { type: String, default: '200px' },
  },
  data() {
    return {
      sortedLessons: [],
      selectedLessons: [],
      words: [],
      currentIndex: 0,
      userInput: '',
      isPracticing: false,
      practiceCompleted: false,
      feedback: '',
      errorMessage: '',
    };
  },
  computed: {
    currentWord() {
      return this.words[this.currentIndex] || {};
    },
    remainingWords() {
      return this.words.length - this.currentIndex;
    },
    correctCount() {
      return this.words.filter(w => w.correct).length;
    },
    answeredWords() {
      return this.words.slice(0, this.currentIndex).slice().reverse();
    },
    wrongWords() {
      return this.words.filter(w => !w.correct);
    },
    feedbackClass() {
      if (this.feedback === '正确！') return 'feedback-correct';
      if (this.feedback.startsWith('错误')) return 'feedback-wrong';
      return '';
    },
  },
  created() {
    this.loadLessons();
  },
  methods: {
    async loadLessons() {
      try {
        const res = await fetch(this.listUrl);
        if (!res.ok) throw new Error();
        const list = await res.json();
        this.sortedLessons = list;
      } catch {
        this.errorMessage = '无法加载课程列表。';
      }
    },
    async startPractice() {
      if (this.selectedLessons.length === 0) {
        this.errorMessage = '请选择至少一个课程。';
        return;
      }
      this.errorMessage = '';
      this.words = await this.loadWords();
      this.shuffle(this.words);
      this.currentIndex = 0;
      this.isPracticing = true;
      this.practiceCompleted = false;
      this.feedback = '';
      this.$nextTick(() => this.$refs.inputRef?.focus());
    },
    async loadWords() {
      const words = [];
      for (const lesson of this.selectedLessons) {
        const res = await fetch(`${this.dataPrefix}${lesson}`);
        const text = await res.text();
        for (const line of text.trim().split('\n')) {
          const [chinese, japanese] = line.trim().split(' ');
          if (chinese && japanese) {
            words.push({ chinese, japanese, correct: false });
          }
        }
      }
      return words;
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    },
    checkWord() {
      if (this.practiceCompleted) return;
      if (!this.userInput.trim()) {
        this.feedback = '请输入答案。';
        return;
      }
      const word = this.currentWord;
      if (this.userInput.trim() === word.japanese) {
        this.feedback = '正确！';
        word.correct = true;
      } else {
        this.feedback = `错误！正确答案是：${word.japanese}`;
      }
      this.currentIndex++;
      this.userInput = '';
      if (this.currentIndex >= this.words.length) {
        this.practiceCompleted = true;
      }
    },
    async copyWrongWords() {
      const text = this.wrongWords.map(w => `${w.chinese} ${w.japanese}`).join('\n');
      try {
        await navigator.clipboard.writeText(text);
        alert('错题已复制到剪贴板');
      } catch {
        alert('复制失败，请手动复制');
      }
    },
    resetPractice() {
      this.isPracticing = false;
      this.practiceCompleted = false;
      this.words = [];
      this.currentIndex = 0;
      this.userInput = '';
      this.feedback = '';
      this.selectedLessons = [];
      this.errorMessage = '';
    },
  },
};
</script>

<style scoped>
.practice-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.lessons-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.lesson-item {
  width: 25%;
  box-sizing: border-box;
  padding-left: 40px;
  cursor: pointer;
  text-align: left;
}

.lesson-item input {
  margin-right: 5px;
}

.practice-container {
  margin-bottom: 20px;
}

.prompt-word {
  display: inline-block;
  width: 400px;
}

.word-input {
  padding: 5px;
  margin-left: 10px;
  font-size: 18px;
}

.feedback {
  min-height: 24px;
  margin: 6px 0;
}

.feedback-correct { color: green; }
.feedback-wrong { color: red; }

.progress {
  color: #666;
  font-size: 14px;
}

.results-summary {
  margin-top: 20px;
  margin-bottom: 16px;
}

.wrong-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.wrong-list li {
  padding: 6px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.scrollable-ul {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.scrollable-ul li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.correct { color: green; }
.wrong { color: red; }

.scrollable-ul::-webkit-scrollbar { width: 8px; }
.scrollable-ul::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}
.scrollable-ul::-webkit-scrollbar-thumb:hover { background-color: #555; }

.error { color: red; }
</style>
