<template>
  <el-container>

    <el-header>
      <h1>设备信息展示</h1>
    </el-header>

    <el-main>
      <table class="table">
        <tr>
          <th></th>
          <th>sum</th>
          <th>2g</th>
          <th>5g</th>
        </tr>
        <tr>
          <th>当前</th>
          <td>{{Math.floor(this.stanum.n_2g*this.search.num) + Math.floor(this.stanum.n_5g*this.search.num)}}</td>
          <td>{{Math.floor(this.stanum.n_2g*this.search.num)}}</td>
          <td>{{Math.floor(this.stanum.n_5g*this.search.num)}}</td>
        </tr>
        <tr>
          <th>历史</th>
          <td>{{Math.floor(this.stanum.p_2g*this.search.num) + Math.floor(this.stanum.p_5g*this.search.num)}}</td>
          <td>{{Math.floor(this.stanum.p_2g*this.search.num)}}</td>
          <td>{{Math.floor(this.stanum.p_5g*this.search.num)}}</td>
        </tr>
      </table>
      <table class="table">
        <tr>
          <th></th>
          <th>tx</th>
          <th>rx</th>
        </tr>
        <tr>
          <th>历史流量</th>
          <td>{{this.delta.tx}}</td>
          <td>{{this.delta.rx}}</td>
        </tr>
      </table>
    </el-main>

  </el-container>
</template>

<script>
  import api from "../api";
  import { Base64 } from 'js-base64';
  export default {
    data() {
      return {
        search: {
          name: '',
          num: ''
        },
        stanum: {
          n_2g: 0,
          n_5g: 0,
          p_2g: 0,
          p_5g: 0
        },
        delta: {
          tx: '0MB',
          rx: '0MB'
        }
      };
    },
    mounted() {
      this.search.name = this.$route.params.name;
      const num = Base64.decode(this.$route.params.num);

      this.search.num = num;
      this.onGetstation();
      this.onGetTraffic();
    },
    methods: {
      async onGetstation() {
        const res = await api.get(`public/macGroups/sysInfo`, {
          params: {
            name: this.search.name,
            type: 'station'
          }
        });
        const macStation = res.data.result;

        let macList = [];
        macStation.forEach(val => {
          if (!macList.includes(val.mac)) {
            macList.push(val.mac);
            this.stanum.n_2g += val.payload.stanum_2g;
            this.stanum.n_5g += val.payload.stanum_5g;
            this.stanum.p_2g += val.payload.stanum_2g_period;
            this.stanum.p_5g += val.payload.stanum_5g_period;
          }
        });
      },
      async onGetTraffic() {
        const res = await api.get(`public/macGroups/sysInfo`, {
          params: {
            name: this.search.name,
            type: 'traffic'
          }
        });

        const macTraffic = res.data.result;

        let tx = 0,
          rx = 0;
        macTraffic.forEach(val => {
          tx += (val.payload.tx_2g_delta / 1000000 + val.payload.tx_5g_delta / 1000000);
          rx += (val.payload.rx_2g_delta / 1000000 + val.payload.rx_5g_delta / 1000000);
        });

        this.delta.tx = (tx > 1000) ? `${(tx/1000).toFixed(3)}GB` : `${tx.toFixed(3)}MB`;
        this.delta.rx = (rx > 1000) ? `${(rx/1000).toFixed(3)}GB` : `${rx.toFixed(3)}MB`;
      },
    }
  };

</script>

<style scoped>
  .table {
    width: 100%;
    border: 1px solid #f1f1f1;
    align: "center";
    margin-top: 13px;
  }

  .table td {
    font-family: 微软雅黑;
    font-size: 16px;
    height: 25px;
    line-height: 150%;
    text-align: center
  }

  .table th {
    font-family: 微软雅黑;
    font-size: 16px;
    font-weight: bold;
    color: #255e95;
    background-color: #e9faff;
  }

</style>
