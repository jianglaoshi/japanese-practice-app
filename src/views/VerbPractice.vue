<template>
    <div>
        <h1>日语动词练习</h1>
        <div v-if="!isPracticing">
            <p>请选择要练习的课程：</p>
            <div class="lessons-container">
                <label v-for="lesson in sortedLessons" :key="lesson" class="lesson-item">
                    <input type="checkbox" :value="lesson" v-model="selectedLessons" /> {{ lesson }}
                </label>
            </div>
            <button @click="startPractice">开始练习</button>
        </div>
        <div v-else>
            <div v-if="currentIndex < words.length" class="practice-container">
                <span class="chinese-word">{{ words[currentIndex].chinese }}:</span>
                <input v-model="userInput" @keypress.enter="checkWord" class="word-input" />
                <p v-if="feedback">{{ feedback }}</p>
                <p>还剩 {{ remainingWords }} 个单词，正确：{{ correctWords }}</p>
            </div>
            <div v-if="practiceCompleted" class="results-summary">
                <p>练习结束！总共练习：{{ totalWords }}，正确：{{ correctWords }}</p>
                <button @click="resetPractice">重新开始练习</button>
            </div>
            <ul class="scrollable-ul">
                <li v-for="(word, index) in words.slice(0, currentIndex).reverse()" :key="index">
                    {{ word.chinese }}: {{ word.japanese }} - <span :style="{ color: word.correct ? 'green' : 'red' }">{{
                        word.correct ? '正确' : '错误' }}</span>
                </li>
            </ul>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            lessons: [], // 课程文件名列表
            sortedLessons: [], // 排序后的课程文件名列表
            selectedLessons: [], // 已选择的课程
            words: [], // 单词列表
            currentIndex: 0, // 当前练习到的单词索引
            userInput: '', // 用户输入的单词
            isPracticing: false, // 是否在练习中
            practiceCompleted: false, // 练习是否完成
            feedback: '', // 用户输入单词的反馈
            errorMessage: '' // 错误信息
        };
    },
    created() {
        // 加载课程文件名列表
        this.loadLessons();
    },
    computed: {
        remainingWords() {
            return this.words.length - this.currentIndex;
        },
        totalWords() {
            return this.words.length;
        },
        correctWords() {
            return this.words.filter(word => word.correct).length;
        }
    },
    methods: {
        async loadLessons() {
            try {
                const response = await fetch('/VerbPractice.json'); // 修改为获取 lessonList.json 文件
                if (!response.ok) {
                    throw new Error('Failed to fetch lesson list');
                }
                const lessonList = await response.json();
                // 对课程文件名进行排序
                this.sortedLessons = lessonList.sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)?.[0]);
                    const numB = parseInt(b.match(/\d+/)?.[0]);
                    return numA - numB;
                });
            } catch (error) {
                console.error(error);
                this.errorMessage = '无法加载课程列表。';
            }
        },
        async startPractice() {
            if (this.selectedLessons.length === 0) {
                this.errorMessage = '请选择至少一个练习。';
                return;
            }

            // 加载所选课程的单词列表
            this.words = await this.loadWords();
            // 打乱单词顺序
            this.shuffleWords();
            // 初始化状态
            this.currentIndex = 0;
            this.isPracticing = true;
            this.practiceCompleted = false;
            this.feedback = '';
        },
        async loadWords() {
            let words = [];
            // 从每个选定的课程文件中加载单词列表
            for (let lesson of this.selectedLessons) {
                const response = await fetch(`/Verb/${lesson}`);
                const text = await response.text();
                // 解析每行的单词，并去掉换行符号
                words.push(...text.trim().split('\n').map(line => {
                    const [chinese, japanese] = line.trim().split(' ');
                    return { chinese, japanese, correct: false };
                }));
            }
            return words;
        },
        shuffleWords() {
            // 打乱单词顺序
            for (let i = this.words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
            }
        },
        checkWord() {
            // 只有在练习未完成时才执行检查单词的逻辑
            if (!this.practiceCompleted) {
                // 检查用户输入的单词是否正确
                if (this.userInput.trim() === '') {
                    this.feedback = '请输入答案。';
                    return;
                }

                const currentWord = this.words[this.currentIndex];
                if (this.userInput.trim() === currentWord.japanese) {
                    this.feedback = '正确！';
                    currentWord.correct = true;
                } else {
                    this.feedback = `错误！正确答案是：${currentWord.japanese}`;
                }

                // 更新当前单词索引
                this.currentIndex++;
                // 判断是否练习完成
                if (this.currentIndex === this.words.length) {
                    this.practiceCompleted = true;
                }
                // 清空输入框
                this.userInput = '';
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
        }
    }
};
</script>
  
<style>
.error {
    color: red;
}

.correct {
    color: green;
}

.wrong {
    color: red;
}

.word-input {
    width: 200px;
    /* 固定宽度 */
    padding: 5px;
    margin-left: 10px;
}

.chinese-word {
    width: 400px;
    /* 固定宽度 */
    display: inline-block;
}

.lessons-container {
    display: flex;
    flex-wrap: wrap;
}

.lesson-item {
    width: 25%;
    /* 每行显示5个 */
    box-sizing: border-box;
    padding-left: 40px;
    cursor: pointer;
    text-align: left;
}

.lesson-item input {
    margin-right: 5px;
}


.results-summary {
    margin-top: 20px;
}

.practice-container {
    margin-bottom: 20px;
}

/* Container for the ul element */
.scrollable-ul {
    height: 400px;
    /* Set the desired height */
    overflow-y: auto;
    /* Enable vertical scrolling */
    border: 1px solid #ccc;
    /* Optional: add a border for visual clarity */
    padding: 0;
    /* Remove default padding */
    margin: 0;
    /* Remove default margin */
    list-style-type: none;
    /* Optional: remove bullets */
}

/* Style for li elements */
.scrollable-ul li {
    padding: 10px;
    /* Optional: add padding to list items */
    border-bottom: 1px solid #eee;
    /* Optional: add a bottom border to list items */
}

/* Optional: styling scrollbar */
.scrollable-ul::-webkit-scrollbar {
    width: 8px;
    /* Width of the vertical scrollbar */
}

.scrollable-ul::-webkit-scrollbar-thumb {
    background-color: #888;
    /* Color of the scrollbar thumb */
    border-radius: 4px;
    /* Round the scrollbar thumb */
}

.scrollable-ul::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* Color of the scrollbar thumb on hover */
}
</style>
  