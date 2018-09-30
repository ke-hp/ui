<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    pieData: {
      type: Array | Object,
      required: true
    },
    labels: {
      type: Array | Object,
      required: false
    },
    backgroundColor: {
      type: Array | Object,
      required: false
    },
    data: {
      type: Array | Object,
      required: false
    }
  },
  mounted () {
    function dataDispose (data,type){
      let result=[];
      data.forEach(element => {
        result.push(element[type])
      });
      if(type === "_id"){
        result= result.slice(0,10);
        result.push('其他');
        return result
      }
      if(type==="num"){
        result.splice(10,0,sumArr(result)-sumArr(result.slice(0,10)));
        result = result.slice(0,11)
        return result;
      }
      function sumArr(arr){
        return eval(arr.join("+")) 
      }
    }
    this.renderChart({
      labels: dataDispose(this.pieData, "_id"),
      datasets: [{
        backgroundColor: ['#409EFF','#67C23A','#E6A23C','#F56C6C','#909399','#303133','#FF6347','#FFD700','#808000','	#00BFF','#00CED1'],
        data: dataDispose(this.pieData, "num"),
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    })
  }
}

</script>
