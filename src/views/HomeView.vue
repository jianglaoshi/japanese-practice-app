<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
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
