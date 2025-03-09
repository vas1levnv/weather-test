import { defineStore } from 'pinia'
import axios from 'axios'

interface WeatherEntry {
  dt: number
  temp: number
  weather: { description: string; icon: string }[],
  wind: number,
  humidity: number | string
}

interface CityWeather {
  name: string
  temp: number | string
  weather: string
  icon: string
  humidity: number | string
}

interface WeatherState {
  city: string
  selectedType: string
  hourlyWeather: WeatherEntry[]
  weeklyWeather: WeatherEntry[]
  popularCities: CityWeather[]
  loading: boolean
  error: string | null
}

const API_KEY = 'bd7062940012b2116cd536c18a09c9b4'

export const useWeatherStore = defineStore('weather', {
  state: (): WeatherState => ({
    city: 'Казань',
    selectedType: 'hourly',
    hourlyWeather: [],
    weeklyWeather: [],
    popularCities: [
      { name: 'Москва', temp: '--', weather: 'Неизвестно', icon: '01d', humidity: '--' },
      { name: 'Новосибирск', temp: '--', weather: 'Неизвестно', icon: '01d', humidity: '--' },
      { name: 'Краснодар', temp: '--', weather: 'Неизвестно', icon: '01d', humidity: '--' },
      { name: 'Красноярск', temp: '--', weather: 'Неизвестно', icon: '01d', humidity: '--' },
      { name: 'Тула', temp: '--', weather: 'Неизвестно', icon: '01d', humidity: '--' }
    ],
    loading: false,
    error: null
  }),

  actions: {
    async fetchWeather() {
      this.loading = true
      this.error = null

      try {
        console.log(`📡 Загружаем ${this.selectedType} прогноз...`)
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${API_KEY}&units=metric&lang=ru`
        const response = await axios.get(url)
        const list = response.data.list

        if (this.selectedType === 'hourly') {
          this.hourlyWeather = list.slice(0, 8).map((item: any) => ({
            dt: item.dt,
            temp: item.main.temp,
            weather: item.weather,
            wind: item.wind.speed,
            humidity: item.main.humidity,
          }))
        } else {
          const dailyMap: { [key: string]: any[] } = {}
          list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toLocaleDateString('ru-RU')
            if (!dailyMap[date]) dailyMap[date] = []
            dailyMap[date].push(item)
          })

          this.weeklyWeather = Object.values(dailyMap).slice(0, 7).map((items: any) => {
            const dayData = items[Math.floor(items.length / 2)]
            return {
              dt: dayData.dt,
              temp: dayData.main.temp,
              weather: dayData.weather,
              wind: dayData.wind.speed,
              humidity: dayData.main.humidity,
            }
          })
        }
      } catch (err) {
        this.error = `Ошибка загрузки ${this.selectedType} прогноза`
      } finally {
        this.loading = false
      }
    },

    async fetchPopularCitiesWeather() {
      this.loading = true

      try {
        const requests = this.popularCities.map(async (city) => {
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric&lang=ru`)
            return {
              name: city.name,
              temp: Math.round(response.data.main.temp),
              weather: response.data.weather[0].description,
              icon: response.data.weather[0].icon,
              humidity: response.data.main.humidity
            }
          } catch {
            return { ...city, temp: '--', weather: 'Ошибка', icon: '01d', humidity: '--' }
          }
        })

        this.popularCities = await Promise.all(requests)
      } catch {
        this.error = 'Ошибка загрузки погоды популярных городов'
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentWeather() {
      this.loading = true;
      this.error = null;
    
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${API_KEY}&units=metric&lang=ru`;
        const response = await axios.get(url);
    
        // Получаем текущую дату
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat("ru-RU", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(now);

        return {
          name: this.city,
          temp: Math.round(response.data.main.temp),
          weather: response.data.weather[0].description,
          wind: response.data.wind.speed,
          icon: response.data.weather[0].icon,
          humidity: response.data.main.humidity,
          date: formattedDate, 
        };
      } catch (err) {
        this.error = `Ошибка загрузки текущей погоды для ${this.city}`;
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
})
