<script>
import {
  Line,
  mixins
} from 'vue-chartjs'
const {
  reactiveProp
} = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, {
      showScale: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          },
          gridLines: {
            display: true,
            color: '#EEF0F4',
            borderDash: [5, 15]
          }
        }],
        xAxes: [{
          gridLines: {
            display: true,
            color: '#EEF0F4',
            borderDash: [5, 15]
          }
        }]
      },
      tooltips: {
        backgroundColor: '#4F5565',
        titleFontStyle: 'normal',
        titleFontSize: 18,
        bodyFontFamily: "'Proxima Nova', sans-serif",
        cornerRadius: 3,
        bodyFontColor: '#20C4C8',
        bodyFontSize: 14,
        xPadding: 14,
        yPadding: 14,
        displayColors: false,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: tooltipItem => {
            return `🗓 ${tooltipItem[0].xLabel}`
          },
          label: (tooltipItem, data) => {
            let dataset = data.datasets[tooltipItem.datasetIndex]
            let currentValue = dataset.data[tooltipItem.index]
            return `📦 ${currentValue.toLocaleString()}`
          }
        }
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false
    })
  }
}

</script>
