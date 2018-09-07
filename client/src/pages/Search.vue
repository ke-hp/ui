<template>
    <el-container>

        <el-header>
            <homeHeader/>
        </el-header>

        <el-main>

            <el-form :inline="true" :model="search">
                <el-form-item>
                    <el-input placeholder="请输入内容" ref="inputRef" v-model="search.name" clearable @keyup.enter.native="onSearch">
                        <el-select v-model="search.type" slot="prepend" placeholder="请选择" style="width: 120px;" @change="inputSelect">
                            <el-option label="连接历史" value="connectedHistories"></el-option>
                            <el-option label="操作记录" value="execs"></el-option>
                            <el-option label="设备信息" value="sysinfo"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>

            <el-table :data="connectedData" style="width: 100%" v-show="connectedVisible">
                <el-table-column prop="mac" label="MAC地址">
                </el-table-column>
                <el-table-column prop="time" label="时间">
                </el-table-column>
                <el-table-column prop="connected" label="在线状态">
                </el-table-column>
            </el-table>

            <el-table :data="execData" style="width: 100%" v-show="execVisible">
                <el-table-column prop="mac" label="MAC地址">
                </el-table-column>
                <el-table-column prop="cmd" label="命令">
                </el-table-column>
                <el-table-column prop="user" label="操作者">
                </el-table-column>
                <el-table-column prop="timestamp" label="时间">
                </el-table-column>
            </el-table>

            <el-table :data="infoData" style="width: 100%" v-show="infoVisible">
                <el-table-column prop="mac" label="MAC地址">
                </el-table-column>
                <el-table-column prop="timestamp" label="时间">
                </el-table-column>
                <el-table-column prop="topic" label="主题">
                </el-table-column>
                <el-table-column prop="payload" label="内容">
                </el-table-column>
            </el-table>

            <el-pagination background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page.sync="currentPage" v-show="connectedVisible||execVisible||infoVisible">
            </el-pagination>

        </el-main>

        <el-footer>
            <homeFooter/>
        </el-footer>

    </el-container>
</template>

<script>
import api from "../api";
import moment from "moment";
import homeHeader from "@/components/header.vue";
import homeFooter from "@/components/Footer.vue";
export default {
    components: {
        homeHeader,
        homeFooter
    },
    data() {
        return {
            search: {
                name: "",
                type: "",
                skip: 0
            },
            connectedData: [],
            execData: [],
            infoData: [],
            connectedVisible: false,
            execVisible: false,
            infoVisible: false,
            currentPage: 1
        };
    },
    mounted() {},
    methods: {
        async onSearch() {
            this.connectedVisible = false;
            this.execVisible = false;
            this.infoVisible = false;
            this.currentPage = 1;

            if (this.search.type) {
                switch (this.search.type) {
                    case "connectedHistories":
                        await this.getConnectedHistories();
                        break;

                    case "execs":
                        await this.getExecs();
                        break;

                    case "sysinfo":
                        await this.getSysinfo();
                        break;

                    default:
                        break;
                }
            }
        },
        async inputSelect() {
            this.$refs.inputRef.focus();
        },
        async getConnectedHistories(skip) {
            this.search.skip = skip ? skip - 1 : 0;
            const res = await api.get("ui/connectedHistories", {
                params: this.search
            });

            const result = res.data.result;

            result.forEach(val => {
                val.connected = val.connected.toString();
                val.time = moment(val.time).format("YYYY-MM-DD  HH:mm:ss");
            });

            this.connectedData = result;
            this.connectedVisible = true;
        },
        async getExecs(skip) {
            this.search.skip = skip ? skip - 1 : 0;
            const res = await api.get("ui/execs", {
                params: this.search
            });

            const result = res.data.result;

            result.forEach(val => {
                val.timestamp = moment(parseInt(val.timestamp)).format(
                    "YYYY-MM-DD  HH:mm:ss"
                );
            });
            this.execData = result;
            this.execVisible = true;
        },
        async getSysinfo(skip) {
            this.search.skip = skip ? skip - 1 : 0;
            const res = await api.get("ui/sysinfo", {
                params: this.search
            });

            const result = res.data.result;

            result.forEach(val => {
                val.timestamp = moment(val.timestamp * 1000).format(
                    "YYYY-MM-DD  HH:mm:ss"
                );
                val.payload = JSON.stringify(val.payload);
            });

            this.infoData = result;
            this.infoVisible = true;
        },
        async handleCurrentChange(val) {
            if (this.connectedVisible) {
                await this.getConnectedHistories(val);
            } else if (this.execVisible) {
                await this.getExecs(val);
            } else if (this.infoVisible) {
                await this.getSysinfo(val);
            }
        }
    }
};
</script>