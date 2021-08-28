<template>
  <div>
    <NavTop :page-title="page_title"></NavTop>
    <!--搜索筛选-->
    <!--列表-->
    <div>
      <!--搜索筛选-->
      <el-form :inline="true" :model="formInline" class="user-search">
        <el-form-item :inline="true">
          <el-row>
            <el-col :span="12">
              <el-input
                v-model="formInline.policy_name"
               
                placeholder="请输入策略名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="formInline.policy_code"
               
                placeholder="请输入策略代码"
                clearable=""
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="search"
            >搜索</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="
              add_policy();
              dialogFormEdit = true;
            "
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中..."
      style="width: 100%"
    >
      <el-table-column align="center" type="selection"> </el-table-column>
      <el-table-column sortable prop="policy_name" label="策略名称">
      </el-table-column>
      <el-table-column sortable prop="policy_code" label="策略代码">
      </el-table-column>

      <el-table-column sortable prop="update_user_id" label="上次更新人员">
      </el-table-column>
      <el-table-column
        sortable
        prop="update_date"
        align="center"
        label="修改时间"
      >
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon=" el-icon-edit"
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row);
              dialogFormEdit = true;
            "
            >编辑</el-button
          >
          <el-button
            type="primary"
            icon=" el-icon-edit"
            size="mini"
            @click="
              view(scope.$index, scope.row);
              dialogFormEdit = true;
            "
            >查看</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="remove_access(scope.$index, scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <el-dialog
      :close-on-click-modal="false"
      @close="closeDialog"
      :inline="true"
      :title="dialog_tile"
      :visible.sync="dialogFormEdit"
    >
      <el-form v-model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="策略名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="edit"
                  v-model="form.policy_name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="策略代码" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="edit"
                  v-model="form.policy_code"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="策略描述" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="edit"
                  type="textarea"
                  size="large"
                  v-model="form.policy_descri"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import NavTop from "../../components/nav_top/nav_top.vue";
import Pagination from "../../components/pagination/pagination.vue";

export default {
  data() {
    return {
      page_title: "策略管理",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      dialog_tile: "",
      edit: "true",
      editForm: {
        deptId: "",
        deptName: "",
        deptNo: "",
        token: localStorage.getItem("logintoken"),
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      form: {},
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        policy_name: "",
        policy_code: "",
        token: localStorage.getItem("logintoken"),
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
    };
  },
  // 注册组件
  components: {
    Pagination,
    NavTop,
  },
  // 创建完毕
  created() {
    this.getdata();
  
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取策略列表
    getdata() {
      this.loading = true;
      let policy_name = this.formInline.policy_name;
      let policy_code = this.formInline.policy_code;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (policy_name != "") {
        params.policy_name = policy_name;
      }
      if (policy_code != "") {
        params.policy_code = policy_code;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getPolicyList,
        params: params,
        data: "",
      })
        .then((response) => {
          this.listData = response.data.data.rows; //数据放入listdata
          this.pageparm.total = response.data.data.total; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm.currentPage = this.formInline.page;
      this.pageparm.pageSize = this.formInline.limit;
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata(this.formInline);
    },
    // 搜索事件
    search() {
      this.getdata();
    },
    //增加策略
    add_policy() {
      this.editFormVisible = true;
      this.dialog_tile = "新增策略信息";
      this.edit = false;
      this.form = {};
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.dialog_tile = "编辑策略信息";
      this.form = row;
      this.edit = false;
    },
    view(index, row) {
      this.editFormVisible = true;
      this.dialog_tile = "查看策略详情";
      this.form = row;
      this.edit = true;
    },
    // 编辑、增加页面保存方法
    submitForm() {
      let that = this;
      let data = that.form;

      if (that.form.id != null && that.form.id != "") {
        this.$confirm("是否保存策略信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.updatePolicy,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "策略信息修改成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "策略信息修改失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        this.$confirm("是否保存你新建的策略信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.addPolicy,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "策略信息添加成功",
                  type: "success",
                  duration: 3000,
                });
                this.form.id = response.data.data;
              } else {
                this.$message({
                  message: "策略信息添加失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    },
    // 移除设备
    remove_access(index, row) {
      this.$confirm("确定移除该策略吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.removePolicy,
            data: this.$qs.stringify({ id: row.id }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "策略信息删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "策略信息删除失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          //
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.getdata(); //关闭以后刷新数据
      this.editFormVisible = false;
    },
  },
};
</script>

<style >
.page-box {
  margin: 0.5rem;
}
.user-search {
  margin-top: 2rem;
  position: absolute;
  right: 2rem;
}
.userRole {
  width: 100%;
}
.el-table {
  margin-top: 6rem;
}
.el-dialog {
  max-height: calc(100% - 30px) !;
  max-width: calc(100% - 30px) !;

  text-align: left;
}
</style>