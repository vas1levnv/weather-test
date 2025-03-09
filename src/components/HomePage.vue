<template>
  <div class="home-page">
    <div v-if="currentWeather" class="home-page__top">
      <h1 class="home-page__title">Погода в городе {{ currentWeather.name }}</h1>
      <div class="home-page__date">{{ currentWeather.date }}</div>
    </div>
    <div v-if="weatherStore.loading">Загрузка...</div>
    <div v-else-if="weatherStore.error">{{ weatherStore.error }}</div>
    <div class="home-page__content" v-else>
      <div class="home-page__hourly" v-if="weatherStore.selectedType === 'hourly'">
        <div>
          <div class="home-page__current" v-if="currentWeather">
            <div class="home-page__current-left">
              <img class="home-page__current-img" :src="`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`" alt="Иконка погоды" />
              <div class="home-page__current-temp">{{ currentWeather.temp }}°</div>
            </div>
            <div class="home-page__current-right">
              <div class="text-capitalize">{{ currentWeather.weather }}</div>
              <div>Влажность: {{ currentWeather.humidity }}%</div>
              <div>Ветер: {{ formatNumber(currentWeather.wind) }} м/с</div>
            </div>
          </div>
        </div>
        <div>
          <div class="home-page__hourly-list">
            <div class="home-page__hourly-item" v-for="entry in weatherStore.hourlyWeather" :key="entry.dt">
              <div>
                <div>{{ formatTime(entry.dt) }}</div>
                <div>{{ getTimeOfDay(entry.dt) }}</div>
              </div>
              <div class="home-page__hourly-temp">{{ formatNumber(entry.temp) }}°</div>
              <div class="home-page__hourly-weather">
                <img :src="`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`" alt="Иконка погоды" />
                <div>{{ entry.weather[0].description }}</div>
              </div>
              <div>{{ formatNumber(entry.wind) }} м/с</div>
              <div>{{ entry.humidity }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="home-page__weekly" v-else>
        <div class="home-page__weekly-list">
          <div v-for="entry in weatherStore.weeklyWeather"
            class="home-page__weekly-item"
            :key="entry.dt">
            <div class="text-capitalize">{{ formatDate(entry.dt) }}</div>
            <img :src="`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`" alt="Иконка погоды" />
            <div>{{ formatNumber(entry.temp) }}°</div>
          </div>
        </div>
      </div>
    </div>
    <PopularCities />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useWeatherStore } from '../store/weather'
import PopularCities from './PopularCities.vue'

const weatherStore = useWeatherStore()
const currentWeather = ref<Awaited<ReturnType<typeof weatherStore.fetchCurrentWeather>> | null>(null)

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('ru-RU', { weekday: 'long' })
}

const getTimeOfDay = (timestamp: number): string => {
  const hours = new Date(timestamp * 1000).getHours();

  if (hours >= 5 && hours < 12) return "утро";
  if (hours >= 12 && hours < 18) return "день";
  if (hours >= 18 && hours < 22) return "вечер";
  return "ночь";
};

const formatNumber= (num: number): number => {
  return Math.floor(num);
}

const updateWeather = async () => {
  await weatherStore.fetchWeather()
  currentWeather.value = await weatherStore.fetchCurrentWeather()
}

onMounted(updateWeather)

watch(() => [weatherStore.city, weatherStore.selectedType], updateWeather)
</script>

<style scoped lang="scss">
.home-page{
  padding: 56px 0 0;
}

.home-page__top{
  margin-bottom: 48px;
}

.home-page__title{
  font-size: 36px;
  font-weight: 600;
  margin: 0;
}

.home-page__date{
  font-size: 30px;
  color: #E9E9F399;
  margin-top: 12px;
}

.home-page__content{
  margin-bottom: 56px;
}

.home-page__hourly{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.home-page__current{
  display: flex;
  align-items: center;
  gap: 30px;
}

.home-page__current-left{
  display: flex;
  align-items: center;
  gap: 15px;
}

.home-page__current-img{
  width: 180px;
  height: 180px;
}

.home-page__current-temp{
  font-size: 100px;
  line-height: 120%;
}

.home-page__current-right{
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 24px;
}

.home-page__hourly-list{
  display: grid;
  grid-template-columns: 1fr;
}

.home-page__hourly-item{
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
  align-items: center;
  text-align: center;
  padding: 5px 0 0;
  gap: 10px;
  border-bottom: 1px solid #E9E9F31A;
  font-size: 18px;
  font-weight: 400;

  & img{
    height: 60px;
    width: 60px;
  }
}

.home-page__hourly-weather{
  display: flex;
  align-items: center;
  text-align: start;
}

.home-page__hourly-temp{
  font-size: 48px;
  font-weight: 600;
}

.home-page__weekly-list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.home-page__weekly-item{
  width: 120px;
  text-align: center;
  font-weight: 400;
}

@media (max-width: 1024px){
  .home-page__current{
    flex-direction: column;
  }

  .home-page__hourly{
    grid-template-columns: 1fr;
  }
  .home-page__current{
    text-align: center;
  }
}

@media (max-width: 768px){
  .home-page__top{
    margin-bottom: 20px;
  }

  .home-page__title{
    font-size: 24px;
  }
  .home-page__date{
    font-size: 20px;
  }

  .home-page__current{
    gap: 16px;
  }

  .home-page__current-temp{
    font-size: 56px;
  }

  .home-page__current-img{
    width: 100px;
    height: 100px;
  }

  .home-page__hourly-item{
    font-size: 14px;
    gap: 4px;
  }

  .home-page__hourly-temp{
    font-size: 24px;
  }
}

@media (max-width: 400px){
  .home-page__hourly-item{
    padding: 13px 0;
    grid-template-columns: 1fr 1fr 2fr;
    row-gap: 8px;
    & img{
      display: none;
    }
  }
}

</style>
