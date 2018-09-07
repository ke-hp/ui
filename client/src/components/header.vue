<template>
    <div class="menu" style="widht:100%">
        <div class="logo">
            <h1>NRadio</h1>
        </div>
        <el-menu mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">
                <icon name="home"></icon>&nbsp;&nbsp;首页</el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <icon name="cog"></icon>&nbsp;&nbsp;设备管理</template>
                <el-menu-item index="2-1">设备列表</el-menu-item>
                <el-menu-item index="2-2">命令管理</el-menu-item>
                <el-menu-item index="2-3">信息搜索</el-menu-item>
                <el-menu-item index="2-4">设备分组</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <icon name="user"></icon>&nbsp;&nbsp;账户管理</template>
                <el-menu-item index="3-1">个人信息</el-menu-item>
                <el-menu-item index="3-2">新增账户</el-menu-item>
                <el-menu-item index="">版本:{{version}}</el-menu-item>
            </el-submenu>
            <el-menu-item index="4">
                <icon name="power-off"></icon>&nbsp;&nbsp;退出</el-menu-item>
        </el-menu>

        <el-dialog title="修改密码" :visible.sync="userVisible" center>
            <el-form :model="user">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="user.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="user.password" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userVisible = false">取消</el-button>
                <el-button type="primary" @click="onUpdate" :loading="loading">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增账户" :visible.sync="addUserVisible" center>
            <el-form :model="addUser">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="addUser.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="addUser.password" type="password" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserVisible = false">取消</el-button>
                <el-button type="primary" @click="onAddUser" :loading="loading">确认</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import api from "../api";
import pke from "../../package.json";
export default {
    data () {
        return {
            version: pke.version,
            account: "",
            user: {
                name: '',
                password: ""
            },
            userVisible: false,
            addUser: {
                name: "",
                password: "!Z@X3c4v"
            },
            addUserVisible: false,
            loading: false,
            formLabelWidth: "80px"
        };
    },
    mounted () {
        this.account = localStorage.getItem("account");
        this.user.name = this.account;
    },
    methods: {
        async handleSelect (key) {
            switch (key) {
                case "1":
                    this.$router.push("/");
                    break;
                case "2-1":
                    this.$router.push("/home");
                    break;
                case "2-2":
                    this.$router.push("/command");
                    break;
                case "2-3":
                    this.$router.push("/search");
                    break;
                case "2-4":
                    this.$router.push("/makeGroup");
                    break;
                case "3-1":
                    this.userVisible = true;
                    break;
                case "3-2":
                    this.addUserVisible = true;
                    break;
                case "4":
                    this.logout();
                    break;
                default:
                    this.$router.push("/");
                    break;
            }
        },
        async onUpdate () {
            try {
                const res = await api.put(
                    `ui/users/${localStorage.getItem("id")}`,
                    {
                        password: this.user.password
                    }
                );
                const result = res.data;

                this.userVisible = false;
                localStorage.clear();
                this.$router.push("/login");
            } catch (error) {
                this.userVisible = false;
                this.$notify.error({
                    title: "错误",
                    message: "密码修改失败！"
                });
            }
        },
        async onAddUser () {
            try {
                const res = await api.post("ui/users", {
                    account: this.addUser.name,
                    password: this.addUser.password
                });
                this.addUserVisible = false;
                this.$notify({
                    title: "成功",
                    message: "账号创建成功！",
                    type: "success"
                });
            } catch (error) {
                let message = "账号创建失败!";
                if (error.message === "user already exist") {
                    message = "用戶已存在";
                }
                this.userVisible = false;
                this.$notify.error({
                    title: "错误",
                    message: message
                });
            }
        },
        async logout () {
            try {
                const res = await api.delete("ui/logout");
                localStorage.clear();
                this.$router.push("/login");
            } catch (error) {
                this.userVisible = false;
                this.$notify.error({
                    title: "错误",
                    message: "退出失败！"
                });
            }
        }
    }
};
</script>
<style>
.logo {
  float: left;
  padding-left: 2%;
}
.menu {
  width: 100%;
  height: 60px;
  border-bottom: solid 1px #e6e6e6;
}
.menu ul {
  float: right;
}
</style>

