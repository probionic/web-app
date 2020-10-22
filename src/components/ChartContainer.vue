<template>
  <div class="q-gutter-md q-pa-md text-center" >
    <div class="container linechart">
      <line-chart
        v-if="loaded"
        :chartData="chartdata"
        :options="options"/>
    </div>
  </div>
</template>

<script>
import LineChart from './Chart.vue'

export default {
  name: 'LineChartContainer',
  components: { LineChart },
  methods: {
  },
  data () {
    return {
      data: [],
      sockData: [],
      loaded: false,
      chartdata: {
        datasets: [{
          label: 'Surface Electromyography (sEMG) signals',
          data: null,
          pointRadius: 0.1,
          pointStyle: 'circle'
        }]
      },
      options: {
        animation: {
          duration: 0
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            // This more specific font property overrides the global property
            fontSize: 16
          }
        },
        scaleShowValues: true,
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              maxTicksLimit: 10
            },
            scaleLabel: {
              display: true,
              labelString: 'Sample index',
              fontSize: 14
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Signal rectified amplitude (V)',
              fontSize: 14
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              stepSize: 0.5,
              max: 5
            }
          }]
        }
      }
    }
  },
  created () {
    this.loaded = false
    try {
      var clientId = Date.now()
      var ws = new WebSocket(`ws://192.168.0.7:8000/ws/${clientId}`)
      this.loaded = true
      var count = 0
      var dataPoint = 0
      var labels = []
      ws.onmessage = (event) => {
        this.sockData = JSON.parse(event.data)
        if (count === 150) {
          console.log(this.data)
          this.chartdata = {
            labels: labels,
            datasets: [{
              label: 'sEMG signal',
              data: this.data,
              pointRadius: 0.1,
              pointStyle: 'circle',
              borderColor: 'blue',
              showLine: true
            }]
          }
          count = 0
          this.data = []
          labels = []
        } else {
          this.data.push(this.sockData[this.sockData.length - 1])
          labels.push(dataPoint)
          dataPoint += 1
          count += 1
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
<style scoped>
  .linechart {
    width: 800px;
    height: 200px;
  }
</style>
