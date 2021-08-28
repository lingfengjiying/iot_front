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
                v-model="formInline.nick_name"
                placeholder="请输入分类名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="formInline.company_name"
                placeholder="输入分类描述"
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
              add_useradd_user();
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
      <el-table-column sortable prop="name" label="分类名称"> </el-table-column>
      <el-table-column sortable prop="id" label="分类id"> </el-table-column>
      <el-table-column sortable prop="update_nickname" label="更新人昵称">
      </el-table-column>
      <el-table-column sortable prop="description" label="分组描述">
      </el-table-column>
      <el-table-column sortable prop="updateDate" label="更新日期">
      </el-table-column>
      <!-- <template slot-scope="scope">
          <div>{{ scope.row.editTime | timestampToTime }}</div>
        </template> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row, 'edit');
              dialogFormEdit = true;
            "
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteDevice(scope.$index, scope.row)"
            >删除</el-button
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
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类描述" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  v-model="form.description"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">保存</el-button>
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
      page_title: "分类管理",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        deptId: "",
        deptName: "",
        deptNo: "",
        token: localStorage.getItem("logintoken"),
      },
      dialog_tile: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      organization_list: [],
      form: {},
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        nick_name: "",
        company_name: "",
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
    this.getdata(this.formInline);
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata() {
      this.loading = true;
      let nick_name = this.formInline.nick_name;
      let company_name = this.formInline.company_name;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (nick_name != "") {
        params.nick_name = nick_name;
      }
      if (company_name != "") {
        params.company_name = company_name;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceGroupList,
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
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      var that = this;
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getOrganizationSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        async: true,
      })
        .then((response) => {
          that.organization_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      that.form = row;
      that.editFormVisible = true;
      that.dialog_tile = "新增分类";
      that.form = row;
    },
    //显示添加用户界面
    add_useradd_user() {
      this.dialog_tile = "新增分类";
      this.form = [];
    },
    // 删除用户
    deleteDevice(index, row) {
      this.$confirm("确定删除该用户吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.delDeviceGroup,
            data: this.$qs.stringify({ id: row.id }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "分类信息删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "分类信息删除，请联系管理员",
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
    //保存数据
    submitForm() {
      console.log(this.form);
      let that = this;
      let data = that.form;

      if (that.form.id != null && that.form.id != "") {
        this.$confirm("是否保存分类?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.updateDeviceGroup,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备类别信息修改成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "设备类别信息修改失败，请联系管理员",
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
        this.$confirm("是否保存你新建的设备分类?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.addDeviceGroup,
            data: this.$qs.stringify(data),
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备分类添加成功",
                  type: "success",
                  duration: 3000,
                });
                this.form.id = response.data.data;
              } else {
                this.$message({
                  message: "设备分类添加失败，请联系管理员",
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
    //下拉列表设置nickname
    set_company_name(label) {
      this.form.company_name = label;
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