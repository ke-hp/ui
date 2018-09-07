<template>
  <el-main>
    <div class="div">
      <el-form :model="loginForm" :rules="rules" label-width="25%" class="demo-ruleForm">
        <el-form-item>
          <h2 style="margin-bottom:0;">NRadio</h2>
        </el-form-item>
        <el-form-item label="" prop="account">
          <el-input v-model="loginForm.account" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" placeholder="密码" type="password" @keyup.enter.native="onLogin"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>

</template>

<script>
import api from "../api";
export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                account: "",
                password: ""
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 20,
                        message: "长度在 6 到 20 个字符",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        async onLogin() {
            if (
                this.loginForm.account.length != 0 &&
                this.loginForm.password.length != 0
            ) {
                try {
                    const res = await api.post("/login", this.loginForm);
                    const result = res.data;
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("account", result.account);
                    localStorage.setItem("id", result.id);
                    this.$router.push("/");
                } catch (error) {
                    this.$router.push("/login");
                    this.$notify.error({
                        title: "错误",
                        message: "账号或密码错误！"
                    });
                }
            } else {
                this.$notify.error({
                    title: "错误",
                    message: "请输入账号密码"
                });
            }
        }
    }
};
</script>
<style>
.div {
    background: rgb(255, 255, 255);
    width: 20%;
    height: 250px;
    margin-left: 34%;
    padding-right: 5%;
    padding-bottom: 3%;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.267);
    border-radius: 10px;
    position: absolute;
    top: 20%;
}

</style>

