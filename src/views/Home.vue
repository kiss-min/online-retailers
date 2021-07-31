<template>
  <el-container>
    <el-header>
      <div class="it">
        <img src="/src/assets/heima.b5a855ee (1).png" alt="" />
        <div style="color: #fff">电商后台管理系统</div>
      </div>
      <div class="i">
        <el-button type="primary" @click="cl">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          :unique-opened="true"
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menu"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icon[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/'+child.path"
                v-for="child in item.children"
                :key="child.id"
                >{{ child.authName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menu: [],
      icon: {
        "0": "el-icon-user",
        "1": "el-icon-s-operation",
        "2": "el-icon-s-goods",
        "3": "el-icon-s-order",
        "4": "el-icon-s-marketing"
      },
    };
  },
  created() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.$router.push({
        name: "Longin",
      });
    }
    this.query();
  },
  methods: {
    query() {
      this.myaxios.get("menus").then((res) => {
        this.menu = res.data.data;
      });
    },
    cl(){
      window.sessionStorage.clear()
      this.$router.push('/')
    },
  },
};
</script>
<style scoped>
.el-header,
.el-footer {
  background-color: #373d41;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header{
  display: flex;
  justify-content: space-between;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.it {
  display: flex;
}
.el-container {
  height: 100%;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}

</style>