<template>
	<div class="popular-cities">
  
	  <div v-if="weatherStore.loading">Загрузка...</div>
	  <div v-else-if="weatherStore.error">{{ weatherStore.error }}</div>
	  <template v-else>
		<h2 class="popular-cities__title">
			Погода в популярных городах
			<svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect y="0.5" width="38" height="38" rx="19" fill="#E9E9F3" fill-opacity="0.1"/>
				<path d="M17.2027 22.1106C16.9965 21.312 16.9192 20.6603 16.9707 20.1555C17.0296 19.6507 17.1954 19.2288 17.4679 18.8897C17.7404 18.5507 18.1049 18.2305 18.5616 17.9291C19.2097 17.4921 19.6442 17.1342 19.8652 16.8555C20.0935 16.5692 20.2076 16.2452 20.2076 15.8836C20.2076 15.3562 20.0235 14.9644 19.6553 14.7082C19.287 14.4445 18.7457 14.3127 18.0313 14.3127C17.4715 14.3127 16.967 14.3955 16.5178 14.5613C16.0685 14.7195 15.6193 14.9418 15.17 15.2281L14.4519 12.5271C14.6434 12.3462 14.949 12.1579 15.3688 11.962C15.796 11.7586 16.3042 11.589 16.8934 11.4534C17.4826 11.3178 18.1197 11.25 18.8046 11.25C19.7768 11.25 20.6458 11.412 21.4118 11.736C22.1851 12.0599 22.7964 12.5195 23.2457 13.1147C23.7023 13.7024 23.9306 14.3955 23.9306 15.1942C23.9306 15.6613 23.8459 16.0908 23.6765 16.4825C23.5145 16.8743 23.242 17.2623 22.859 17.6466C22.4834 18.0233 21.9789 18.4339 21.3455 18.8784C20.9184 19.1723 20.6053 19.451 20.4065 19.7147C20.2076 19.9784 20.0935 20.2949 20.064 20.664C20.0419 21.0257 20.0714 21.5079 20.1524 22.1106H17.2027ZM18.7494 27.75C18.1896 27.75 17.7035 27.5692 17.2911 27.2075C16.8787 26.8384 16.6724 26.3486 16.6724 25.7384C16.6724 25.324 16.7645 24.9661 16.9486 24.6647C17.1401 24.3634 17.3942 24.1298 17.7109 23.964C18.0276 23.7983 18.3738 23.7154 18.7494 23.7154C19.3165 23.7154 19.8026 23.9 20.2076 24.2692C20.6127 24.6308 20.8152 25.1205 20.8152 25.7384C20.8152 26.1527 20.7195 26.5106 20.528 26.812C20.3439 27.1134 20.0935 27.3431 19.7768 27.5014C19.4675 27.6671 19.125 27.75 18.7494 27.75Z" fill="#E9E9F3"/>
			</svg>
		</h2>
		<div  class="popular-cities__list">
			<div v-for="city in weatherStore.popularCities"
				class="popular-cities__item"
				@click="changeCity(city.name)"
				:key="city.name">
			<div class="popular-cities__item-name">{{ city.name }}</div>
			<div class="text-capitalize">{{ city.weather }}</div>
			<img :src="getWeatherIcon(city.icon)" alt="Weather Icon">
			<div class="popular-cities__item-temp">{{ city.temp }}°</div>
			<div>Влажность: {{ city.humidity }}%</div>
			</div>
		</div>
		</template>
	</div>
  </template>
  
<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeatherStore } from '../store/weather'

const weatherStore = useWeatherStore()

const getWeatherIcon = (iconCode: string) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`

const changeCity = (newCity: string) => {
  weatherStore.$patch({ city: newCity }) // Обновляем состояние стора
}

onMounted(() => {
	weatherStore.fetchPopularCitiesWeather()
})
</script>
  
<style scoped lang="scss">

.popular-cities__title{
	display: flex;
	align-items: center;
	gap: 16px;
	font-size: 36px;
	margin: 0;
}

.popular-cities__list {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 37px;
	margin-top: 32px;
}

.popular-cities__item{
	cursor: pointer;
	text-align: center;
	padding: 25px;
	background-color: #EEEDED1A;
	border-radius: 8px;

	& img{
		width: 80px;
		height: 80px;
	}
}

.popular-cities__item-name{
	margin-bottom: 8px;
	font-size: 24px;
	font-weight: 500;
}

.popular-cities__item-temp{
	margin: 0 0 8px;
	font-size: 48px;
	font-weight: 600;
}

@media (max-width: 1440px){
  .popular-cities__list{
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
  }
}


@media (max-width: 1024px){
  .popular-cities__list{
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
  }
}

@media (max-width: 768px){
  .popular-cities__title{
	font-size: 24px;
  }
}

@media (max-width: 576px){
  .popular-cities__list{
	grid-template-columns: 1fr;
  }
  .popular-cities__item{
	padding: 8px;
  }
}

</style>
  