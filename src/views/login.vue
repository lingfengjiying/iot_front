<template>
  <div class="login-wrap">
    <el-form
      label-position="left"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登陆</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "jack_sosindg",
        password: "lijie965214",
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, max: 20, message: "长度在5- 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取info列表

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const name = this.ruleForm.username;
          const password = this.ruleForm.password;
         
          const url = this.api.INTERFACES.login;
          this.$axios({
            method: "get",
            url: url,
             Headers:{ "Content-Type": "application/json;charset=utf-8" },
            params: {
              name: name,
              password: password,
            },
          })
            .then((response) => {
              if (response.data.code == 200) {
                this.$store.commit("login", response.data.data.token);
                this.$router.push("index");
              } else {
                this.$message.error(response.data.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$message.error("请输入用户名密码！");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  background-color: #112345;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 10%;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2 rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
