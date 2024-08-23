<template>
  <div class="score-container">
    <div class="pie-chart">
      <canvas ref="pieCanvas"></canvas>
    </div>
    <span class="score-text">{{ score }}%</span>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'PieChart',
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.pieCanvas.getContext('2d')

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Score', 'Remaining'],
          datasets: [
            {
              data: [this.score, 100 - this.score],
              backgroundColor: ['#66bb6a', '#ef5350', '#ffca28', '#42a5f5', '#ab47bc'], // Multiple colors
              hoverBackgroundColor: ['#66bb6a', '#ef5350', '#ffca28', '#42a5f5', '#ab47bc'],
              borderWidth: 1,
              borderColor: '#2c3e50', // Match border to background
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          cutout: '70%',  // Adjust to look more like a full circle
          layout: {
            padding: 0,
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.score-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.pie-chart {
  width: 30px;  /* Set a fixed width for the pie chart */
  height: 30px; /* Set a fixed height for the pie chart */
  margin-right: 8px; /* Add some space between the chart and the score text */
  position: relative;
}

canvas {
  display: block;
  width: 100% !important;  /* Ensure the canvas fits the container */
  height: 100% !important; /* Ensure the canvas fits the container */
}

.score-text {
  font-size: 14px;
  color: #d1d5db; /* Light text color */
}
</style>
