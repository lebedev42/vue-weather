<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h2>Weather App on Vue.js</h2>
    <main-weather-component></main-weather-component>
  </div>
</template>

<script>
  import MainWeatherComponent from 'components/MainWeatherComponent'
  export default {
    name: 'app',
    data: function () {
      return {
        msg: 'Welcome to Weather App'
      }
    },
    components: {
      MainWeatherComponent
    }
  }
</script>

<style lang="scss">
  #app {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
