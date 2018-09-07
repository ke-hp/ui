<template>
    <el-container>

        <el-header>
            <homeHeader/>
        </el-header>

        <el-main>
            <el-form :inline="true" :model="search">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="search.name" clearable @keydown.enter.native="onSubmit"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">搜索</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" stripe style="width: 100%" border>
                <el-table-column prop="company" label="用户" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.company }}
                        <el-button @click="handleClick(scope.row)" type="text" size="small">
                            <icon name="pencil"></icon>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="mac" label="MAC地址" sortable>
                </el-table-column>
                <el-table-column prop="ver" label="设备版本" sortable>
                </el-table-column>
                <el-table-column prop="ap" label="关联AP" sortable>
                </el-table-column>
                <el-table-column prop="sta" label="在线终端" sortable>
                </el-table-column>
                <el-table-column prop="connected" label="设备状态" sortable>
                    <template slot-scope="scope">
                        <span v-if= scope.row.connected style="color: #42b983">在线</span>
                        <span v-if= !scope.row.connected style="color: #e06c75">离线</span>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="在线 / 离线时长" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if= scope.row.connected>
                        <el-button @click="commandClick(scope.row)" type="text" size="small">
                            <icon name="exchange"></icon>
                        </el-button>
                        <el-button @click="cmdClick(scope.row)" type="text" size="small">
                            <icon name="terminal"></icon>
                        </el-button>
                        <el-button @click="settingClick(scope.row)" type="text" size="small">
                            <icon name="tv"></icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="total" :current-page.sync="currentPage">
            </el-pagination>
        </el-main>

        <el-footer>
            <homeFooter/>
        </el-footer>

        <el-dialog title="设备信息" :visible.sync="visible" center>
            <el-form :model="form">
                <el-form-item label="MAC" :label-width="formLabelWidth">
                    <el-input v-model="form.mac" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户" :label-width="formLabelWidth">
                    <el-input v-model="form.company"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="onUpdate" :loading="loading">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="发送命令" :visible.sync="commandVisible" center>
            <el-form :model="command">
                <el-form-item label="MAC地址" :label-width="formLabelWidth">
                    <el-input v-model="command.mac" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="命令" :label-width="formLabelWidth">
                    <el-select v-model="command.abbr" allow-create default-first-option filterable remote :remote-method="getCommands" @change="selectChange">
                        <el-option v-for="item in commandList" :key="item.id" :label="item.abbr" :value="item.command">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" autosize v-model="command.command" @change="valChange">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="commandVisible = false">取消</el-button>
                <el-button type="primary" @click="onCommand" :loading="commandLoading">确认</el-button>
            </div>
            <el-input type="textarea" v-model="showData" :autosize="{ minRows: 3, maxRows: 6}">
            </el-input>
        </el-dialog>

    </el-container>
</template>

<script>
import api from "@/api";
import moment from "moment";
import homeHeader from "@/components/header.vue";
import homeFooter from "@/components/Footer.vue";
export default {
    components: {
        homeHeader,
        homeFooter
    },
    data () {
        return {
            search: {
                name: "",
                skip: 0
            },
            tableData: [],
            total: 0,
            currentPage: 1,
            form: {
                mac: "",
                company: ""
            },
            visible: false,
            command: {
                mac: "",
                abbr: "",
                command: ""
            },
            commandVisible: false,
            commandLoading: false,
            loading: false,
            formLabelWidth: "80px",
            showData: "",
            commandList: []
        };
    },
    mounted () {
        this.initData();
    },
    methods: {
        async initData () {
            await this.getMacs();
        },
        handleClick (val) {
            this.form = val;
            this.visible = true;
        },
        async commandClick (val) {
            this.showData = "";
            this.command = val;
            this.commandVisible = true;
        },
        async cmdClick (val) {
            let newWin = window.open();
            try {
                const res = await api.post("ui/commands/rssh", {
                    mac: val.mac
                });
                const token = localStorage.getItem("token");
                newWin.location.href = `wetty?tk=${token}&pt=${res.data.port}`;
            } catch (err) {
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        async settingClick (val) {
            let newWin = window.open();
            try {
                const res = await api.post("ui/commands/rweb", {
                    mac: val.mac
                });
                const token = localStorage.getItem("token");
                newWin.location.href = `cgi-bin/luci/`;
            } catch (err) {
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        resultFilter (val) {
            return state => {
                let macStatus =
                    state.mac &&
                    state.mac.toLowerCase().search(val.toLowerCase()) != -1;
                let companyStatus =
                    state.company &&
                    state.company.toLowerCase().search(val.toLowerCase()) != -1;
                if (macStatus) {
                    state.name = state.mac;
                } else if (companyStatus) {
                    state.name = state.company;
                }
                return macStatus || companyStatus;
            };
        },
        async onSubmit (event) {
            event.preventDefault
                ? event.preventDefault()
                : (event.returnValue = false);
            await this.getMacs();
        },
        async handleCurrentChange (val) {
            await this.getMacs(val);
        },
        async onUpdate () {
            try {
                const res = await api.put(
                    `ui/macs/${this.form._id}`,
                    this.form
                );

                this.visible = false;
                this.total = 1;
                this.currentPage = 1;
                const result = res.data.result;

                // result.connected = result.connected.toString();
                result.time =
                    Math.ceil(moment().diff(result.time, "hours")) + "h";
                this.tableData = [result];
            } catch (error) {
                this.visible = false;
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        async getCommands (val) {
            try {
                const res = await api.get("ui/commands", {
                    params: {
                        name: val,
                        skip: 0
                    }
                });
                this.commandList = res.data.result;
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "获取数据失败！"
                });
            }
        },
        async selectChange (val) {
            this.command.command = val;
        },
        async valChange (val) {
            this.command.command = val;
            this.command.abbr = "";
        },
        async onCommand () {
            this.commandLoading = true;
            this.showData = "";
            try {
                const res = await api.post("ui/commands/send", {
                    mac: this.command.mac,
                    command: this.command.command
                });
                this.showData =
                    res.data.message.data || JSON.stringify(res.data.message);
            } catch (error) {
                this.showData = "请求超时！";
            }

            this.commandLoading = false;
        },
        async getMacs (skip) {
            this.search.skip = skip ? skip - 1 : 0;
            try {
                const res = await api.get("ui/macs", {
                    params: this.search
                });
                this.total = res.data.count;
                const result = res.data.result;
                result.forEach(ele => {
                    if (!ele.company) {
                        ele.company = moment(ele.time, moment.ISO_8601).format(
                            "YYYY.MM.DD"
                        );
                    }
                    ele.time =
                        (moment().diff(ele.time) / 3600000).toFixed(2) + "h";
                    // ele.connected = ele.connected.toString();
                });
                this.tableData = result;
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "获取数据失败！"
                });
            }
        }
    }
};
</script>

