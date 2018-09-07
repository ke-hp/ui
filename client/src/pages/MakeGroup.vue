<template>
    <el-container>

        <el-header>
            <homeHeader/>
        </el-header>

        <el-main class="el-main">
            <el-form :inline="true" :model="search">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="search.name" clearable @keydown.enter.native="onSubmit"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createClick">创建分组</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="showGroup" style="width: 100%" border>
                <el-table-column prop="name" label="组名" sortable>
                </el-table-column>
                <el-table-column prop="macs" label="设备" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteClick(scope.row)" type="text" size="small">
                            删除
                            <icon name="trash"></icon>
                        </el-button>
                        <el-button @click="updateClick(scope.row)" type="text" size="small">
                            修改
                            <icon name="pencil"></icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page.sync="currentPage">
            </el-pagination>

        </el-main>

        <el-footer>
            <homeFooter/>
        </el-footer>

        <el-dialog title="创建分组" :visible.sync="createVisible" center>
            <el-form :model="createGroup">
                <el-form-item label="组名">
                    <el-input placeholder="请输入组名" v-model="createGroup.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备">
                    <el-input placeholder="请输入设备MAC" type="textarea" v-model="createGroup.macs" clearable @keyup.enter.native="onCreateGroup"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createVisible = false">取消</el-button>
                <el-button type="primary" @click="onCreateGroup">创建</el-button>
            </div>
        </el-dialog>

        <el-dialog title="更新分组" :visible.sync="updateVisible" center>
            <el-form :model="updateGroup">
                <el-form-item label="组名">
                    <el-input placeholder="请输入组名" v-model="updateGroup.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备">
                    <el-input placeholder="请输入设备MAC" type="textarea" v-model="updateGroup.macs" clearable @keyup.enter.native="onUpdateGroup"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateVisible = false">取消</el-button>
                <el-button type="primary" @click="onUpdateGroup">更新</el-button>
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
    data() {
        return {
            search: {
                name: "",
                skip: 0
            },
            showGroup: [],
            currentPage: 1,
            createVisible: false,
            createGroup: {
                name: "",
                macs: ""
            },
            updateVisible: false,
            updateGroup: {
                name: "",
                macs: ""
            }
        };
    },
    mounted() {
        this.getGroup();
    },
    methods: {
        async getGroup(skip) {
            this.search.skip = skip ? skip - 1 : 0;
            try {
                const res = await api.get("ui/macGroups", {
                    params: this.search
                });

                this.showGroup = res.data.result;
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "获取数据失败！"
                });
            }
        },
        async onSubmit() {
            await this.getGroup();
        },
        async handleCurrentChange(val) {
            await this.getGroup(val);
        },
        createClick() {
            this.createGroup = {
                name: "",
                macs: []
            };
            this.createVisible = true;
        },
        async onCreateGroup() {
            try {
                const res = await api.post("ui/macGroups", this.createGroup);
                this.createVisible = false;
                this.currentPage = 1;
                this.showGroup = [res.data.result];
                this.$notify({
                    title: "成功",
                    message: "创建成功！",
                    type: "success"
                });
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "创建失败！"
                });
            }
        },
        updateClick(val) {
            this.updateVisible = true;
            this.updateGroup = val;
        },
        async onUpdateGroup() {
            try {
                const res = await api.put(
                    `ui/macGroups/${this.updateGroup._id}`,
                    this.updateGroup
                );
                this.updateVisible = false;
                this.showGroup = [res.data.result];
                this.currentPage = 1;
                this.$notify({
                    title: "成功",
                    message: "更新成功！",
                    type: "success"
                });
            } catch (error) {
                this.$notify.error({
                    title: "错误",
                    message: "更新失败！"
                });
            }
        },
        async deleteClick(val) {
            try {
                await api.delete(`ui/macGroups/${val._id}`);
                await this.getGroup();
                this.$notify({
                    title: "成功",
                    message: "删除成功！",
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
