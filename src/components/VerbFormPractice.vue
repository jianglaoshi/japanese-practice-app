<template>
    <div>
        <form v-if="currentVerb && currentForm" @submit.prevent="handleSubmit">
            <p>原形：{{ currentVerb.plainForm }}</p>
            <label>
                请输入{{ getFormLabel(currentForm) }}：
                <input type="text" v-model="answer" @keyup.enter="handleSubmit" />
            </label>
            <!-- <button type="submit">提交</button> -->
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <ul class="scrollable-ul">
            <li v-for="(result, index) in results.slice().reverse()" :key="index"
                :class="{ correct: result.correct, incorrect: !result.correct }">
                {{ result.verb.plainForm }} - {{ getFormLabel(result.form) }}: {{ result.answer }} ({{ result.correct ? '正确'
                    : '错误' }}) - 正确答案: {{ result.correctAnswer }}
            </li>
        </ul>
        <div v-if="!currentVerb && !currentForm">
            <p>练习结束！</p>
            <p>总成绩：{{ results.filter(result => result.correct).length }}/{{ practiceCount }}</p>
            <button @click="$emit('restart')">重新开始练习</button>
            <!-- <ul>
                <li v-for="(result, index) in results" :key="index"
                    :class="{ correct: result.correct, incorrect: !result.correct }">
                    {{ result.verb.plainForm }} - {{ getFormLabel(result.form) }}: {{ result.answer }} ({{ result.correct ?
                        '正确' : '错误' }}) - 正确答案: {{ result.correctAnswer }}
                </li>
            </ul> -->
        </div>
    </div>
</template>
  
<script>
import Verb from '../Verb';

//const forms = ["masu", "te", "ta", "nai", "imperative", "volitional", "potential", "conditional", "Passivity"];

export default {
    name: 'VerbFormPractice',
    props: {
        verbs: Array,
        practiceCount: Number,
        selectedForms: Array,
    },
    data() {
        return {
            currentPractice: [],
            currentVerb: null,
            currentForm: '',
            answer: '',
            errorMessage: '',
            results: [],
            testForms: [],
        };
    },
    watch: {
        practiceCount: {
            immediate: true,
            handler() {
                this.generatePracticeSet();
            }
        }
    },
    methods: {
        generatePracticeSet() {
            if (this.verbs.length > 0 && this.practiceCount > 0) {
                const exercises = [];

                console.log(this.selectedForms)

                for (let i = 0; i < this.practiceCount; i++) {
                    this.testForms.push(this.selectedForms[Math.floor(Math.random() * this.selectedForms.length)]);
                }
                const verbForms = new Map();
                this.testForms.forEach(form => verbForms.set(form, []));

                // 根据动词类型和变形类型分组
                this.verbs.forEach(verbData => {
                    const verb = new Verb(verbData.plainForm, verbData.type);
                    this.testForms.forEach(form => {
                        verbForms.get(form).push({ verb, form });
                    });
                });
                // console.log(forms);
                // 随机选择练习题目
                this.testForms.forEach(form => {
                    const formsArray = verbForms.get(form);
                    for (let i = 0; i < Math.min(this.practiceCount / this.testForms.length, formsArray.length); i++) {
                        const randomIndex = Math.floor(Math.random() * formsArray.length);
                        exercises.push(formsArray[randomIndex]);
                        formsArray.splice(randomIndex, 1);
                    }
                });

                this.currentPractice = exercises;
                // console.log(this.currentPractice);
                // 打乱题目顺序
                this.currentPractice = this.currentPractice.sort(() => Math.random() - 0.5);
                this.currentPractice = this.currentPractice.slice(0, this.practiceCount);
                this.results = [];
                this.currentIndex = 0;
                this.setNextPractice();
            }
        },
        setNextPractice() {
            if (this.currentIndex < this.currentPractice.length) {
                const { verb, form } = this.currentPractice[this.currentIndex];
                this.currentVerb = verb;
                this.currentForm = form;
            } else {
                this.currentVerb = null;
                this.currentForm = '';
            }
        },
        handleSubmit() {
            if (!this.answer.trim()) {
                this.errorMessage = '请输入答案！';
                return;
            }

            const correctAnswer = this.getCorrectAnswer(this.currentVerb, this.currentForm);
            const isCorrect = this.answer === correctAnswer;

            this.results.push({
                verb: this.currentVerb,
                form: this.currentForm,
                answer: this.answer,
                correct: isCorrect,
                correctAnswer: correctAnswer,
            });

            this.answer = '';
            this.errorMessage = '';
            this.currentIndex += 1;
            this.setNextPractice();
        },
        getCorrectAnswer(verb, form) {
            switch (form) {
                case 'masu':
                    return verb.getMasuForm();
                case 'te':
                    return verb.getTeForm();
                case 'ta':
                    return verb.getTaForm();
                case 'nai':
                    return verb.getNaiForm();
                case 'imperative':
                    return verb.getImperativeForm();
                case 'volitional':
                    return verb.getVolitionalForm();
                case 'potential':
                    return verb.getPotentialForm();
                case 'conditional':
                    return verb.getConditionalForm();
                case 'Passivity':
                    return verb.getPassivity();
                case 'Causative':
                    return verb.getCausative();
                case 'Causative2':
                    return verb.getCausative2();
                default:
                    return '';
            }
        },
        getFormLabel(form) {
            switch (form) {
                case 'masu':
                    return 'ます形';
                case 'te':
                    return 'て形';
                case 'ta':
                    return 'た形';
                case 'nai':
                    return 'ない形';
                case 'imperative':
                    return '命令形';
                case 'volitional':
                    return '意志形';
                case 'potential':
                    return '可能形';
                case 'conditional':
                    return '假定形';
                case 'Passivity':
                    return '被动形';
                default:
                    return '';
            }
        },
    },
};
</script>
  
<style scoped>
form {
    margin-top: 20px;
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

.error {
    color: red;
    height: 20px;
    /* 固定高度 */

}

.error:empty {
    height: 20px;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #369d73;
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
  