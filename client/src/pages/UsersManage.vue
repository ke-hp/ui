<template>
    <el-container>

        <el-header>
            <homeHeader/>
        </el-header>

        <el-main>

            <el-table :data="tableData" stripe style="width: 100%" border>
                <el-table-column prop="name" label="客户名称" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                        <el-button @click="updateUserNameClick(scope.row)" type="text" size="small">
                            <icon name="pencil"></icon>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="account" label="账户" sortable>
                </el-table-column>
                <el-table-column prop="privileges" label="权限" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.privileges=="admin"?"管理员":"代理商" || ""}}
                        <el-button  @click="updateUsergPrivilegesClick(scope.row)" type="text" size="small">
                            <icon name="wrench"></icon>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="agentBingMacClick(scope.row)" type="button" size="small">
                            批量关联设备
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="total" :current-page.sync="currentPage">
            </el-pagination>
            <div>
            </div>
        </el-main>

        <el-footer>
            <homeFooter/>
        </el-footer>

        <el-dialog title="修改名称" :visible.sync="updateUserNameVisible" center>
            <el-form :model="form">
                <el-form-item label="账户" :label-width="formLabelWidth">
                    <el-input v-model="form.account" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateUserNameVisible = false">取消</el-button>
                <el-button type="primary" @click="userNameUpdate" :loading="loading">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置权限" :visible.sync="updateUserPrivilegesVisible" center>
            <el-form :model="form">
                    <el-input v-model="form.account" :disabled="true"></el-input>
                <template>
                    <br><br>
                    <el-select v-model="value" placeholder="选择权限">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateUserPrivilegesVisible = false">取消</el-button>
                <el-button type="primary" @click="updateUserPrivileges" :loading="loading">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="批量管理设备" :visible.sync="macBingAgentVisible" center>
            <el-form :model="agent">
                <el-form-item label="账户：" :label-width="formLabelWidth">
                    <el-input v-model="agent.account" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="输入的格式为: 006688001112/006688001114/...  或  006688001112 回车 006688001114 或 006688001112 空格 006688001114" type="textarea" :autosize="{ minRows: 10, maxRows: 1000}" v-model="agent.macList" @change="valChange">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="macBingAgentVisible = false">取消</el-button>
                <el-button type="primary" @click="macBingAgent" :loading="loading">确认</el-button>
            </div>
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
                name: "",
                company: "",
                account: "",
                privileges: "",
            },
            updateUserNameVisible: false,
            agent: {
                _id:"",
            },
            macBingAgentVisible: false,
            updateUserPrivilegesVisible: false,
            options: [{
                value: "agent",
                label: "代理商",
            },{
                value: "admin",
                label: "管理员",
            }],
            value:"",
            loading: false,
            formLabelWidth: "80px",
            showData: "",
        };
    },
    mounted () {
        this.initData();
    },
    methods: {
        async initData () {
            await this.getUsers();
        },
        updateUserNameClick (val) {
            this.form = val;
            this.updateUserNameVisible = true;
        },
        updateUsergPrivilegesClick (val) {
            this.form = val;
            this.updateUserPrivilegesVisible = true;
        },
        agentBingMacClick (val) {
            this.showData = "";
            this.agent = val;
            this.macBingAgentVisible = true;
        },
        async handleCurrentChange (val) {
            await this.getUsers(val);
        },
        async userNameUpdate () {
            try {
                if (this.form.name) {

                const res = await api.put(
                    `ui/users/${this.form._id}`,
                    {
                        name: this.form.name,
                    }
                );

                this.updateUserNameVisible = false;
                this.total = 1;
                this.currentPage = 1;
                const result = res.data.result;

                result.time =
                    Math.ceil(moment().diff(result.time, "hours")) + "h";
                this.tableData = [result];
                    
                }
            } catch (error) {
                this.updateUserNameVisible = false;
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        async updateUserPrivileges () {
            try {
                if (this.value) {

                const res = await api.put(
                    `ui/users/${this.form._id}`,
                    {
                        privileges: this.value,
                    }
                );

                this.updateUserPrivilegesVisible = false;
                this.total = 1;
                this.currentPage = 1;
                const result = res.data.result;

                result.time =
                    Math.ceil(moment().diff(result.time, "hours")) + "h";
                this.tableData = [result];
                    
                }
            } catch (error) {
                this.updateUserPrivilegesVisible = false;
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        async valChange (val) {
            this.agent.agent = val;
            this.agent.abbr = "";
        },
        async macBingAgent () {
            try {
                if (this.agent.macList && this.agent._id) {
                    let macList = this.agent.macList.replace(/(^\s*)/,"").replace(/(\s+|\r+|\n+)/g, "/").replace(/(\/*$)/g,"");
                    macList = macList.split("/");
                    macList.forEach((item) => {
                        if (!(/^[A-F0-9]{12}$/.test(item))) {
                            throw {
                                code:98,
                                center:item
                            };
                        }
                    })
                    const res = await api.put(`ui/macBingAgent/${this.agent._id}`,macList);
                    this.updateUserNameVisible = false;
                }
            } catch (err) {
                if (err.code === 98) {
                    this.$notify.error({
                        title: "错误",
                        message: `${err.center}不符合规则,请检查后重新输入！`
                    });
                }
                this.showData = "请求超时！";
            }
        },
        async getUsers (skip) {
            this.search.skip = skip ? skip - 1 : 0;
            try {
                const res = await api.get("ui/userList", {
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

