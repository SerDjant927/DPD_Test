<template>
  <div>
    <input type="text" v-model="searchKeyword" @keyup.enter="updateTable"
      placeholder="Введите ключевые слова">
    <table>
      <thead>
        <tr>
          <th>Аватар</th>
          <th>ФИО</th>
          <th>Пол</th>
          <th>Страна</th>
          <th>Дата рождения</th>
          <th>Адрес электронной почты</th>
          <th>Телефон</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in paginatedResults" :key="result.login.uuid">
          <td><img :src="result.picture.thumbnail" alt="Аватар"></td>
          <td>{{ result.name.first }} {{ result.name.last }}</td>
          <td>{{ result.gender }}</td>
          <td>{{ result.location.country }}</td>
          <td>{{ result.dob.date }}</td>
          <td>{{ result.email }}</td>
          <td>{{ result.phone }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="previousPage" :disabled="currentPage === 1">Предыдущая страница</button>
      <button @click="goToPage(page)" v-for="page in totalPages" :key="page" :disabled="currentPage === page">{{ page
        }}</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Следующая страница</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import apiData from './api.json'
interface Result {
  name: { first: string; last: string };
  gender: string;
  location: { country: string };
  dob: { date: string };
  email: string;
  phone: string;
}
export default {
  setup () {
    const results = ref<Result[]>([])
    const currentPage = ref(1)
    const pageSize = 20
    const searchKeyword = ref('')

    const totalPages = computed(() => {
      return Math.ceil(filteredResults.value.length / pageSize)
    })

    const filteredResults = computed(() => {
      if (searchKeyword.value === '') {
        return results.value
      } else {
        const keywords = searchKeyword.value.toLowerCase().split(' ')
        return results.value.filter(result => {
          const fullName = `${result.name.first} ${result.name.last} ${result.gender} ${result.location.country} ${result.dob.date} ${result.email} ${result.phone}`.toLowerCase()
          return keywords.some(keyword => fullName.includes(keyword))
        })
      }
    })

    const paginatedResults = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize
      console.log('startIndex;', startIndex)
      const endIndex = startIndex + pageSize
      return filteredResults.value.slice(startIndex, endIndex)
    })

    const loadData = (): void => {
      try {
        const data: { results: Result[] } = apiData
        results.value = data.results
        console.log('Данные загружены:', data)
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const updateTable = () => {
      currentPage.value = 1
      const queryParams = new URLSearchParams()
      queryParams.set('search', searchKeyword.value)
      queryParams.set('page', currentPage.value.toString())
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`
      window.history.pushState({ path: newUrl }, '', newUrl)
    }

    const goToPage = (page: number) => {
      currentPage.value = page
    }

    window.addEventListener('popstate', () => {
      const queryParams = new URLSearchParams(window.location.search)
      searchKeyword.value = queryParams.get('search') || ''
      currentPage.value = parseInt(queryParams.get('page') || '1')
      updateTable()
    })

    loadData()
    const queryParams = new URLSearchParams(window.location.search)
    searchKeyword.value = queryParams.get('search') || ''
    currentPage.value = parseInt(queryParams.get('page') || '1')
    updateTable()

    return {
      results,
      currentPage,
      pageSize,
      searchKeyword,
      totalPages,
      filteredResults,
      paginatedResults,
      loadData,
      previousPage,
      nextPage,
      updateTable,
      goToPage
    }
  }
}
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  table {
    font-size: 12px;
  }

  th,
  td {
    padding: 5px;
  }
}

input[type="text"],
input[type="button"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
