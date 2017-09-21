<template>
    <div class="weather-cards-container">

        <md-card v-for="(data, index) in weather_data" :key="data.id">
            <md-card-header>
                <md-card-header-text>
                    <div class="md-title">{{data.name}}</div>
                    <div class="md-subhead">{{data.weather[0].description}}</div>
                    <div class="md-title">{{data.main.temp | toCelsius}} &#8451;</div>

                    <div class="md-subhead">General Update</div>
                    <div class="md-subhead">{{data.dt | formatDate }}</div>
                </md-card-header-text>

                <md-card-media md-big>
                    <img :src="'./dist/weather-icons/'+trimCharacter(data.weather[0].icon)+'.png'">
                    <div class="md-subhead">{{data.weather[0].main}}</div>
                </md-card-media>
            </md-card-header>
            <md-card-actions>
                <md-button @click.native="deleteWeatherCard(index)">Delete</md-button>
            </md-card-actions>
        </md-card>

    </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'ShowWeatherCardsComponent',
    props: {
        'weather': {
            type: Array,
        }
    },
    data: function () {
        return {
            weathers: this.weather
        }
    },
    computed: {
        weather_data() {
            return this.weathers
        }
    },
    methods: {
        trimCharacter(e) {
            return e.trim();
        },
        deleteWeatherCard(index) {
          var local_weather_data = JSON.parse(localStorage.getItem('weather_data'));

          for (var i=0;i<local_weather_data.length; i++) {
            if (local_weather_data[i].id === this.weathers[index].id ) {
              local_weather_data.splice(local_weather_data[i], 1);
              this.weathers.splice(index, 1);
              localStorage.setItem('weather_data', JSON.stringify(this.weathers));
            }
          }
        }
    },
    filters: {
        formatDate: function (value) {
            if (value)
                return moment.unix(value).format("MM/DD/YYYY hh:mm");
        },
        toCelsius: function (value) {
            if (value)
                return Math.round(value - 273.15);
        }
    }
  }

</script>

<style lang="scss">

    .weather-cards-container {
        margin-top: 20px;
    }
    .md-card {
        width: 100%;
        max-width: 334px;
        margin: 0 8px 16px;
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        height: 270px;
    }
    .md-card .md-card-header {
        margin-bottom: 10px;
    }

</style>