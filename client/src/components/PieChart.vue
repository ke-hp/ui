<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    pieData: {
      type: Array | Object,
      required: true
    }
  },
  mounted () {
    this.renderChart({
      labels: ['在线数量', '离线数量'],
      datasets: [{
        backgroundColor: [
          '#41B883',
          '#E46651'
        ],
        data: this.pieData
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    })
  }
}

</script>
