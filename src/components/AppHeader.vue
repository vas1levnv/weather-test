<script setup lang="ts">
import { ref } from 'vue'
import { useWeatherStore } from '../store/weather'
import { ArrowDownBold } from "@element-plus/icons-vue"


const weatherStore = useWeatherStore()
const selectedType = ref<'hourly' | 'weekly'>('hourly')

const changeType = (type: 'hourly' | 'weekly') => {
  selectedType.value = type
  weatherStore.$patch({ selectedType: type })
}

const changeCity = (newCity: string) => {
  weatherStore.$patch({ city: newCity })
}
</script>

<template>
  <div class="app-header">
    <div class="app-header__selector">
      <ElButton @click="changeType('hourly')"
        class="custom-button"
        :class="{ active: selectedType === 'hourly' }">Главная</ElButton>
      <ElButton @click="changeType('weekly')" 
        class="custom-button"
        :class="{ active: selectedType === 'weekly' }">Погода за неделю</ElButton>
    </div>

    <ElSelect
      v-model="weatherStore.city"
      :suffix-icon="ArrowDownBold"
      class="custom-select"
      @change="changeCity"
    >
      <ElOption
        v-for="item in weatherStore.popularCities"
        :key="item.name"
        :label="item.name"
        :value="item.name"
      />
    </ElSelect>
  </div>
</template>

<style lang="scss" scoped>
  .app-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .app-header__selector{
    border-radius: 8px;
    overflow: hidden;
  }

  .custom-button{
    background-color: #E9E9F333;
    color: #FFFFFF66;
    padding: 10px 16px;
    font-size: 22px;
    font-weight: 600;
	  line-height: 120%;
    height: 100%;
    border: none;
    border-radius: 0;
    border-right: 1px solid #E9E9F333; 


    & + .custom-button{
      margin: 0;
      border-right: none
    }

    &:hover, &.active{
      color: white;
      background-color: #E9E9F333;
      border-color: #E9E9F333;
    }
    &:focus{
      outline: none;
    }
  }



  @media (max-width: 768px){
    .custom-button{
      font-size: 16px;
      padding: 6px 8px;
    }
  }

  @media (max-width: 768px){
    .app-header{
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
