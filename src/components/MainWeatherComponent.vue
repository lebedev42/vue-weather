<template>
<div>
    <md-input-container>
        <md-input @input='change' v-model="selection" placeholder="Type City Name"></md-input>
    </md-input-container>
    <div class="md-menu-content md-select-content md-theme-default md-multiple undefined md-size-0 md-active"
         :class="{'open':openSuggestion}">

        <md-list>
            <md-list-item v-for="(city, index) in matches" :key="city.id">
                <a href="#" @click="suggestionClick(index)" class="md-list-item-container md-button">{{ city.name }}, {{ city.country }}</a>
            </md-list-item>
        </md-list>
    </div>
    <div class="main-button">
        <md-button class="md-raised md-primary" :disabled="buttonDisabled" @click.native="getWeatherFromApi">Get current weather data</md-button>
    </div>

    <show-weather-cards-component :weather='weather'></show-weather-cards-component>
</div>
</template>

<script>
  import ShowWeatherCardsComponent from 'components/ShowWeatherCardsComponent'

  export default {
    name: 'MainWeatherComponent',

    data: function () {
      return {
        open: false,
        button: true,
        cities : [{name: ''}],
        selection: '',
        choicedCityId: '',
        weather_data: []
      }
    },

    computed: {
        weather() {
            if (this.weather_data  && localStorage.getItem('weather_data')) {
                return this.weather_data = JSON.parse(localStorage.getItem('weather_data'));
            } else {
                return this.weather_data;
            }
        },
        matches() {
            return this.cities.filter((city) => {
                return city.name.toLowerCase().indexOf(this.selection.toLowerCase()) >= 0;
            }).slice(0, 10);
        },
        openSuggestion() {
            return this.selection !== "" &&
              this.matches.length != 0 &&
              this.open === true;
        },
        buttonDisabled() {
            return this.button
        }
    },
    mounted: function () {
        // Defer the callback to be executed after the next DOM update cycle
        this.$nextTick(function () {

            var resource = this.$resource('/weather{/city_id}'),
                local_weather_data = JSON.parse(localStorage.getItem('weather_data')),
                weather_array = [];

            if (local_weather_data) {

                localStorage.clear();

                for (var i=0;i<local_weather_data.length; i++) {
                    resource.get({city_id: local_weather_data[i].id }).then(response => {
                        weather_array.push(response.body)
                        localStorage.setItem('weather_data', JSON.stringify(weather_array));
                    }, response => {
                        // error callback
                    });
                }
            }
        })
    },
    methods: {
        change() {
            if ( this.selection.length <= 1 ) {
                var resource = this.$resource('/cities{/letter}');
                resource.get({letter: this.selection.charAt(0)}).then(response => {
                    this.cities = response.body;
                    this.button = false;
                }, response => {
                    // error callback
                });
            }
            if (!this.open)
              this.open = true;
        },
        suggestionClick(index) {
            this.choicedCytiId = this.matches[index]._id;
            this.selection = this.matches[index].name + ', ' + this.matches[index].country;
            this.open = false;
        },
        getWeatherFromApi() {
            var resource = this.$resource('/weather{/city_id}');
            resource.get({city_id: this.choicedCytiId}).then(response => {
                this.selection = '';
                this.button = true;
                var weather_object = {};
                weather_object = response.body;
                this.weather_data.push(weather_object);

                localStorage.setItem('weather_data', JSON.stringify(this.weather_data));

            }, response => {
                // error callback
            });
        }
    },
    components: {
      ShowWeatherCardsComponent
    }
  }

</script>

<style lang="scss">

    .md-input-container {
        max-width: 300px;
        margin: 0 auto;
    }

    .md-menu-content {
        width: 360px;
        overflow: auto;
        display: none;
        z-index: 999;
        background-color: #ffffff;

        position:absolute;
        left: 0;
        right: 0;
        margin: 20px auto;
    }
    .md-menu-content.open {
        display: block;
    }
    .md-list {
        width: 100%;
    }

    .main-button {
        display: block;
        margin-top: 20px;
    }


</style>