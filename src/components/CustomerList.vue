<template>
  <div class="table-container">
    <h2>Your Customers</h2>
    <table class="customer-table">
      <thead>
      <tr>
        <th @click="sort('id')">
          ID
          <span :class="getSortClass('id')"></span>
        </th>
        <th @click="sort('first_name')">
          First Name
          <span :class="getSortClass('first_name')"></span>
        </th>
        <th @click="sort('last_name')">
          Last Name
          <span :class="getSortClass('last_name')"></span>
        </th>
        <th @click="sort('email')">
          Email Address
          <span :class="getSortClass('email')"></span>
        </th>
        <th @click="sort('score')">
          Score
          <span :class="getSortClass('score')"></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{ customer.id }}</td>
        <td>{{ customer.first_name }}</td>
        <td>{{ customer.last_name }}</td>
        <td>{{ customer.email }}</td>
        <td>
          <PieChart :score="customer.score" />
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination-container">
      <div class="entries-info">
        Showing {{ startEntry }} to {{ endEntry }} of {{ totalEntries }} entries
      </div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="page === 1" class="pagination-button">
          Previous
        </button>
        <div class="page-numbers">
          <button
            @click="updatePage(1)"
            :class="['page-button', { active: page === 1 }]"
          >
            1
          </button>
          <span v-if="startPage > 2" class="ellipsis">...</span>

          <button
            v-for="pageNumber in visiblePages"
            :key="pageNumber"
            @click="updatePage(pageNumber)"
            :class="['page-button', { active: pageNumber === page }]"
          >
            {{ pageNumber }}
          </button>

          <span v-if="endPage < totalPages - 1" class="ellipsis">...</span>
          <button
            @click="updatePage(totalPages)"
            :class="['page-button', { active: page === totalPages }]"
          >
            {{ totalPages }}
          </button>
        </div>
        <button @click="nextPage" :disabled="page === totalPages" class="pagination-button">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from './PieChart.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    PieChart,
  },
  computed: {
    ...mapState(['customers', 'page']),
    totalPages() {
      return Math.ceil(this.totalEntries / this.perPage)
    },
    maxVisiblePages() {
      return 5 // Maximum number of visible page buttons
    },
    startPage() {
      const half = Math.floor(this.maxVisiblePages / 2)
      if (this.page <= half) {
        return 2
      } else if (this.page + half >= this.totalPages) {
        return Math.max(2, this.totalPages - this.maxVisiblePages + 1)
      } else {
        return this.page - half + 1
      }
    },
    endPage() {
      return Math.min(this.startPage + this.maxVisiblePages - 1, this.totalPages - 1)
    },
    visiblePages() {
      const pages = []
      for (let i = this.startPage; i <= this.endPage; i++) {
        pages.push(i)
      }
      return pages
    },
    totalEntries() {
      return 2000 // Replace with dynamic value if available
    },
    perPage() {
      return 30 // Number of entries per page
    },
    startEntry() {
      return (this.page - 1) * this.perPage + 1
    },
    endEntry() {
      return Math.min(this.page * this.perPage, this.totalEntries)
    },
  },
  methods: {
    ...mapActions(['fetchCustomers', 'sortCustomers', 'changePageInStore']),
    sort(column) {
      const newDirection =
        this.$store.state.sortBy === column && this.$store.state.sortDirection === 'asc'
          ? 'desc'
          : 'asc'
      this.sortCustomers({ sortBy: column, sortDirection: newDirection })
      localStorage.setItem('sortBy', column)
      localStorage.setItem('sortDirection', newDirection)
    },
    prevPage() {
      if (this.page > 1) {
        this.updatePage(this.page - 1)
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.updatePage(this.page + 1)
      }
    },
    updatePage(pageNumber) {
      this.changePageInStore(pageNumber) // Call Vuex action to update the page
      localStorage.setItem('currentPage', pageNumber) // Save to localStorage
    },
    getSortClass(column) {
      if (this.$store.state.sortBy === column) {
        return this.$store.state.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc'
      }
      return ''
    },
  },
  mounted() {
    const savedSortBy = localStorage.getItem('sortBy')
    const savedSortDirection = localStorage.getItem('sortDirection')
    const savedPage = localStorage.getItem('currentPage')

    if (savedSortBy && savedSortDirection) {
      this.sortCustomers({ sortBy: savedSortBy, sortDirection: savedSortDirection })
    } else {
      this.fetchCustomers() // Default fetching if no sort state is saved
    }

    if (savedPage) {
      this.updatePage(parseInt(savedPage, 10))
    }
  },
}
</script>

<style scoped>
/* Container Styling */
.table-container {
  padding: 20px;
  background-color: #2f3349;
  color: #d1d5db;
  font-family: 'Arial', sans-serif;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
}

/* Table Styling */
.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.customer-table th,
.customer-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #343a40;
  word-break: break-word;
}

.customer-table th {
  cursor: pointer;
  color: #ffffff;
  position: relative;
}

.customer-table th span::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.customer-table th .sort-asc::after {
  content: '▲';
  font-size: 12px;
  margin-left: 5px;
}

.customer-table th .sort-desc::after {
  content: '▼';
  font-size: 12px;
  margin-left: 5px;
}

.customer-table tbody tr:hover {
  background-color: #343a40;
}

/* Pagination Styling */
.pagination-container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
}

.entries-info {
  font-size: 14px;
  color: #9ca3af;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-button {
  background-color: #343a40;
  color: #d1d5db;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.page-button.active {
  background-color: #2563eb;
  color: #ffffff;
}

.page-button:hover {
  background-color: #495057;
}

.pagination-button {
  background-color: #343a40;
  color: #d1d5db;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #495057;
}

.ellipsis {
  color: #9ca3af;
  font-size: 14px;
  margin: 0 5px;
}
</style>
