<template>
    <div class="menu" style="widht:100%">
        <div class="logo">
            <h1>NRadio</h1>
        </div>
        <el-menu mode="horizontal" @select="handleSelect">
            <el-menu-item v-if="isAdmin" index="1">
                <icon name="home"></icon>&nbsp;&nbsp;首页</el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <icon name="cog"></icon>&nbsp;&nbsp;设备管理</template>
                <el-menu-item index="2-1">设备列表</el-menu-item>
                <el-menu-item v-if="isAdmin" index="2-2">命令管理</el-menu-item>
                <el-menu-item v-if="isSuperAdmin" index="2-3">信息搜索</el-menu-item>
                <el-menu-item v-if="isAdmin" index="2-4">设备分组</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <icon name="user"></icon>&nbsp;&nbsp;账户管理</template>
                <el-menu-item index="3-1">修改密码</el-menu-item>
                <el-menu-item v-if="isSuperAdmin" index="3-3">账户管理</el-menu-item>
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
            addUserVisible: false,
            loading: false,
            formLabelWidth: "80px",
            isAdmin: false,
            isSuperAdmin: false,
        };
    },
    mounted () {
        this.account = localStorage.getItem("account");
        this.user.name = this.account;
        if ("admin" ===localStorage.getItem("privileges")) {
            this.isAdmin = true;
        }
        if ("superAdmin" ===localStorage.getItem("privileges")) {
            this.isSuperAdmin = true;
            this.isAdmin = true;
        }
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
                case "3-3":
                   this.$router.push("/usersManage");
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

