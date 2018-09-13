<template>
    <el-container>

        <el-header>
            <homeHeader/>
        </el-header>

        <el-main>
            <h1 style="font-family:Helvetica Microsoft YaHei; font-size:24px;">鲲鹏无限科技正在为全国 <span style="color:#F56C6C;font-size:26px;">{{ sta }}</span> 位用户提供优质的WI-FI服务</h1>
            <div class="Chart" style="width:100%">
                <h3 style="text-align:center; padding-left:0; ">在线用户</h3>
                <div class="block">
                    <el-date-picker v-model="staTimeValue" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="center" :picker-options="pickerOptions2" unlink-panels>
                    </el-date-picker>
                    <el-button icon="el-icon-search" size="mini" type="primary" :loading= staLoading @click="getLineData('sta')">查询</el-button>
                </div>
                <line-chart :chart-data="staDatacollection" :height="300" v-if="staLineLoaded"></line-chart>
            </div>

            <div class="Chart">
                <h3><span>在线路由</span><span style="float:right; padding-right:6%; color:#67C23A">{{ ac }}</span></h3>
                <div class="block">
                    <el-date-picker v-model="acTimeValue" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="center" :picker-options="pickerOptions2" unlink-panels>
                    </el-date-picker>
                    <el-button icon="el-icon-search" size="mini" type="primary" :loading= acLoading @click="getLineData('ac')">查询</el-button>
                </div>
                <line-chart :chart-data="acDatacollection" :height="300" v-if="acLineLoaded"></line-chart>
            </div>

            <div class="Chart" style="margin-left:1%;">
                <h3><span>在线AP</span><span style="float:right; padding-right:6%; color:#67C23A">{{ ap }}</span></h3>
                <div class="block">
                    <el-date-picker v-model="apTimeValue" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="center" :picker-options="pickerOptions2" unlink-panels>
                    </el-date-picker>
                    <el-button icon="el-icon-search" size="mini" type="primary" :loading= apLoading @click="getLineData('ap')">查询</el-button>
                </div>
                <line-chart :chart-data="apDatacollection" :height="300" size="mini" v-if="apLineLoaded"></line-chart>
            </div>

            <div class="Chart">
                <h3>新增用户</h3>
                <div class="block">
                    <el-date-picker v-model="addstaTimeValue" size="mini" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="center" :picker-options="pickerOptions2" unlink-panels>
                    </el-date-picker>
                    <el-button icon="el-icon-search" size="mini" type="primary" :loading= addstaLoading @click="getStaGrowtLineData('addsta')">查询</el-button>
                </div>
                <line-chart :chart-data="addstaDatacollection" :height="300" v-if="addstaLineLoaded"></line-chart>
            </div>

            <div class="Chart" style="margin-left:1%;">
                <h3>设备实时在线图</h3>
                <pie-chart :pie-data="pieChartData" :height="300" v-if="pieLoaded"></pie-chart>
            </div>

        </el-main>

        <el-footer>
            <homeFooter/>
        </el-footer>

    </el-container>
</template>

<script>
import api from "@/api";
import {
    dateToYear,
    dateToMonth,
    dateToWeek,
    dateToDay,
    dateToHour,
    dateToMinute
} from "@/utils/dateFormatter";

import homeHeader from "@/components/header";
import homeFooter from "@/components/Footer.vue";
import pieChart from "@/components/PieChart";
import lineChart from "@/components/LineChart";

export default {
    components: {
        homeHeader,
        pieChart,
        lineChart,
        homeFooter
    },
    data() {
        return {
            sta: "",
            ac: "",
            ap: "",

            staLoading: false,
            acLoading: false,
            apLoading: false,
            addstaLoading: false,

            pieChartData: [],
            pieLoaded: false,

            staLineStoreData: [],
            acLineStoreData: [],
            apLineStoreData: [],
            addstaLineStoreData: [],

            staDatacollection: null,
            acDatacollection: null,
            apDatacollection: null,
            addstaDatacollection: null,

            staLineLoaded: false,
            acLineLoaded: false,
            apLineLoaded: false,
            addstaLineLoaded: false,

            staLineLabels: [],
            acLineLabels: [],
            apLineLabels: [],
            addstaLineLabels: [],

            staLineData: [],
            acLineData: [],
            apLineData: [],
            addstaLineData: [],

            acTimeValue: "",
            apTimeValue: "",
            staTimeValue: "",
            addstaTimeValue: "",

            pickerOptions2: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            value6: "",
            value7: ""
        };
    },
    async mounted() {
        await this.getTime("sta");
        await this.getTime("ac");
        await this.getTime("ap");
        await this.getTime("addsta");

        await this.getNumStartData();
        await this.getStaGrowthData();

        await this.dataShow("sta");
        await this.dataShow("ac");
        await this.dataShow("ap");
        await this.dataShow("addsta");
    },
    methods: {
        getTime(type) {
            const end = new Date();
            const start = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
            this[`${type}TimeValue`] = [start, end];
        },
        async getNumStartData() {
            try {
                let res = await api.get("ui/numstat", {
                    params: {
                        timeValue: this.addstaTimeValue
                    }
                });

                this.sta = res.data.result[0].sta;
                this.ac = res.data.result[0].ac;
                this.ap = res.data.result[0].ap;

                let result = res.data.result.reverse();
                this.staLineStoreData = result;
                this.acLineStoreData = result;
                this.apLineStoreData = result;

            } catch (error) {
                console.error(error);
            }
        },
        async getStaGrowthData() {
            try {
                let res = await api.get("ui/chartdata", {
                    params: {
                        timeValue: this.staTimeValue,
                        type:"staGrowth"
                    }
                });

                let result = res.data.result.reverse();
                this.addstaLineStoreData = result;

            } catch (error) {
                console.error(error);
            }
        },
        async getLineData(type) {
            try {
                this[`${type}Loading`] = true;
                let res = await api.get("ui/numstat", {
                    params: {
                        timeValue: this[`${type}TimeValue`]
                    }
                });
                let result = res.data.result;
                this[`${type}LineStoreData`] = result;
                this[`${type}LineStoreData`].reverse();
                await this.dataShow(type);
                this[`${type}Loading`] = false;
            } catch (error) {
                console.log(error);
                this[`${type}Loading`] = false;
            }
        },
        async getStaGrowtLineData(type) {
            try {
                this[`${type}Loading`] = true;
                let res = await api.get("ui/chartdata", {
                    params: {
                        timeValue: this[`${type}TimeValue`],
                        type:"staGrowth"
                    }
                });
                let result = res.data.result;
                this[`${type}LineStoreData`] = result;
                this[`${type}LineStoreData`].reverse();
                await this.dataShow(type);
                this[`${type}Loading`] = false;
            } catch (error) {
                console.log(error);
                this[`${type}Loading`] = false;
            }
        },

        async dataShow(type) {
            let length = this[`${type}LineStoreData`].length;

            if (length <= 145) {
                await this.datafn(type, 1, dateToHour);
            } else if (145 < length && length <= 1009) {
                await this.datafn(type, 6, dateToHour);
            } else if (1009 < length && length <= 4321) {
                await this.datafn(type, 36, dateToDay);
            } else if (4321 < length && length <= 52561) {
                await this.datafn(type, 36 * 28, dateToMonth);
            } else if (52561 < length) {
                await this.datafn(type, 36 * 365, dateToYear);
            }

            this.fillData(type);
            this[`${type}LineLoaded`] = true;
        },

        async datafn(type, divisor, datefn) {
            let valueType = type; 
            if(type==="addsta"){
                valueType = "num";
            }
            this[`${type}LineData`] = [];
            this[`${type}LineLabels`] = [];
            this[`${type}LineStoreData`].forEach((val, key) => {
                if (key === 0 || Number.isInteger((key + 1) / divisor)) {
                    this[`${type}LineData`].push(val[valueType]);
                    this[`${type}LineLabels`].push(datefn(val.time));
                }
            });
        },

        fillData(type) {
            this[`${type}Datacollection`] = {
                labels: this[`${type}LineLabels`],
                datasets: [
                    {
                        backgroundColor: "transparent",
                        borderColor: "#249EBF",
                        pointBackgroundColor: "rgba(0,0,0,0)",
                        pointBorderColor: "rgba(0,0,0,0)",
                        pointHoverBorderColor: "#249EBF",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverRadius: 4,
                        pointHitRadius: 10,
                        pointHoverBorderWidth: 1,
                        borderWidth: 1,
                        data: this[`${type}LineData`]
                    }
                ]
            };
        }
    }
};
</script>

<style>
h3 {
    font-family: "Helvetica", Arial;
    color: #464646;
    text-transform: uppercase;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 5px;
    margin: 0;
    padding-left: 6%;
    padding-top: 6px;
    margin-bottom: 1px;
    text-align: left;
}

.Chart {
    margin-bottom: 10px;
    padding: 5px;
    width: 49.5%;
    padding: 0;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.267);
    border-radius: 10px;
    float: left;
}
</style>