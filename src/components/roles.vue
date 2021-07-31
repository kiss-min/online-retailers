<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="dialogFormVisible = true"
        >添加角色</el-button
      >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :gutter="24"
              v-for="(item, index) in props.row.children"
              :key="index"
            >
              <el-col :span="4">
                <el-tag>{{ item.authName }}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row
                  :gutter="24"
                  v-for="child in item.children"
                  :key="child.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="handleClose(props.row,child.id)"
                      :disable-transitions="false"
                      >{{ child.authName }}</el-tag
                    >
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="info"
                      closable
                      v-for="childInt in child.children"
                      @close="handleClose(props.row,child.id)"
                      :key="childInt.id"
                      >{{ childInt.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="roleName"> </el-table-column>
        <el-table-column label="商品描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="sear(data.row)"
            ></el-button>

            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="del(data.row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-share"
              @click="fe(data.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="商品名称">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="roles">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改角色" :visible.sync="dialogFormVisible1">
        <el-form :model="form">
          <el-form-item label="商品名称">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dele()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配权限" :visible.sync="dialogFormVisible2">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="tree"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="defKeys"
          :props="defaultProps"
          @close="showSetRightDialogClosed"
        >
        </el-tree>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="fen">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      data: [],
      roleId: "",
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      form: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      defKeys: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.myaxios.get("roles").then((res) => {
        console.log(res);
        this.tableData = res.data.data;
      });
    },
    indexMethod(index) {
      return index + 1;
    },
    //添加
    roles() {
      this.myaxios.post("roles", this.form).then((res) => {
        this.query();
        this.dialogFormVisible = false;
      });
    },
    //删除
    del(id) {
      this.myaxios.delete("roles/" + id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log(res);
          this.query();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改
    dele() {
      this.myaxios.put(`roles/${this.form.id}`, this.form).then((res) => {
        this.query();
        this.dialogFormVisible1 = false;
      });
    },
    sear(data) {
      this.dialogFormVisible1 = true;
      this.form = data;
    },
    //分配权限
    fe(data) {
      this.roleId = data.id;
      this.dialogFormVisible2 = true;
      this.myaxios.get("rights/tree").then((res) => {
        console.log(res);
        this.data = res.data.data;
      });
      var arr = [];
      var children1 = data.children;
      for (var i = 0; i < children1.length; i++) {
        var children2 = children1[i].children;
        // console.log(children2)
        for (var j = 0; j < children2.length; j++) {
          var children3 = children2[j].children;
          // console.log(children3)
          for (var k = 0; k < children3.length; k++) {
            arr.push(children3[k].id);
          }
        }
      }
      this.defKeys = arr;
    },
    fen() {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      console.log(keys);
      const idStr = keys.join(",");
      this.myaxios
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message.error("分配权限失败");
          }
          this.$message.success("分配权限成功");
          this.query();
        });
      this.dialogFormVisible2 = false;
    },
    showSetRightDialogClosed() {
      this.defKeys = [];
    },
    //删除权限
    handleClose(roleId,id) {
      this.myaxios.delete(`roles/${roleId.id}/rights/${id}`).then((res) => {
        this.query()
       
      });
    },
  },
};
</script>

<style >
.box-card {
  margin-top: 10px;
}
.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}
.el-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.el-table td,
.el-table th {
  position: static;
}
</style>