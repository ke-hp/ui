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
                <el-form-item>
                    <el-button type="primary" @click="createClick">创建命令</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="showCommand" style="width: 100%" border>
                <el-table-column prop="abbr" label="命令缩写" sortable>
                </el-table-column>
                <el-table-column prop="command" label="完整命令" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteCommand(scope.row)" type="text" size="small">
                            删除
                            <icon name="trash"></icon>
                        </el-button>
                        <el-button @click="updateCmd(scope.row)" type="text" size="small">
                            修改
                            <icon name="pencil"></icon>
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

        <el-dialog title="创建命令" :visible.sync="createVisible" center>
            <el-form :model="createCommand">
                <el-form-item label="命令缩写">
                    <el-input placeholder="请输入命令缩写" v-model="createCommand.abbr" clearable></el-input>
                </el-form-item>
                <el-form-item label="完整命令">
                    <el-input placeholder="请输入完整命令" type="textarea" v-model="createCommand.command" clearable @keyup.enter.native="onCreateCommand"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createVisible = false">取消</el-button>
                <el-button type="primary" @click="onCreateCommand">创建</el-button>
            </div>
        </el-dialog>

        <el-dialog title="更新命令" :visible.sync="updateVisible" center>
            <el-form :model="updateCommand">
                <el-form-item label="命令缩写">
                    <el-input placeholder="请输入命令缩写" v-model="updateCommand.abbr" clearable></el-input>
                </el-form-item>
                <el-form-item label="完整命令">
                    <el-input placeholder="请输入完整命令" type="textarea" v-model="updateCommand.command" clearable @keyup.enter.native="onUpdateCommand"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取消</el-button>
                <el-button type="primary" @click="onUpdateCommand">更新</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import api from "../api";
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
            showCommand: [],
            total: 0,
            currentPage: 1,
            createVisible: false,
            createCommand: {
                abbr: "",
                command: ""
            },
            updateVisible: false,
            updateCommand: {
                abbr: "",
                command: ""
            }
        };
    },
    mounted () {
        this.getCommand();
    },
    methods: {
        async getCommand (skip) {
            this.search.skip = skip ? skip - 1 : 0;
            try {
                const res = await api.get("ui/commands", {
                    params: this.search
                });
                this.total = res.data.count;
                this.showCommand = res.data.result;
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "获取数据失败！"
                });
            }
        },
        async onSubmit () {
            await this.getCommand();
        },
        async handleCurrentChange (val) {
            await this.getCommand(val);
        },
        createClick () {
            this.createCommand = {};
            this.createVisible = true;
        },
        async onCreateCommand () {
            try {
                const res = await api.post("ui/commands", this.createCommand);
                this.createVisible = false;
                this.total = 1;
                this.currentPage = 1;
                this.showCommand = [res.data.result];
                this.$notify({
                    title: "成功",
                    message: "命令创建成功！",
                    type: "success"
                });
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        updateCmd (val) {
            this.updateVisible = true;
            this.updateCommand = val;
        },
        async onUpdateCommand () {
            try {
                const res = await api.put(
                    `ui/commands/${this.updateCommand._id}`,
                    this.updateCommand
                );
                this.updateVisible = false;
                this.showCommand = [res.data.result];
                this.total = 1;
                this.currentPage = 1;
                this.$notify({
                    title: "成功",
                    message: "命令更新成功！",
                    type: "success"
                });
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "命令更新失败！"
                });
            }
        },
        async deleteCommand (val) {
            try {
                await api.delete(`ui/commands/${val._id}`);
                await this.getCommand();
                this.$notify({
                    title: "成功",
                    message: "命令删除成功！",
                    type: "success"
                });
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "删除失败！"
                });
            }
        }
    }
};
</script>
