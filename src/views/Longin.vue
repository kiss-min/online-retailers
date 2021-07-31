<template>
  <div class="login_container">
    <div class="login_box">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm()"
            >提交</el-button
          >
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      input4: "",
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      validate:"",
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.submitForm()
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        this.myaxios
          .post("login", {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
          })
          .then((res) => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                message: "恭喜你，登陆成功",
                type: "success",
                onClose: () => {
                  this.$router.push({
                    name: "Home",
                  });
                  console.log(res.data.data.token);
                  sessionStorage.token = res.data.data.token;
                },
              });
              this.loading = false;
            }
          });
      });
    },
    resetForm() {},
  },
};
</script>

<style scoped>
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  border-radius: 3px;
  top: 50%;
}
.el-form-item__content {
 text-align: right !important;
}
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>