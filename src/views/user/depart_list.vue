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
                v-model="formInline.name"
               
                placeholder="请输入单位名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="formInline.director_name"
            
                placeholder="请输入负责人名称"
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
              add_depart();
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
      <el-table-column sortable prop="name" label="部门名称"> </el-table-column>
      <!-- <el-table-column sortable prop="id" label="部门代码"> </el-table-column> -->

      <el-table-column sortable prop="director_name" label="负责人账户">
      </el-table-column>
      <el-table-column sortable prop="director_nickname" label="负责人昵称">
      </el-table-column>
      <el-table-column
        sortable
        prop="update_time"
        align="center"
        label="修改时间"
      >
      </el-table-column>
      <el-table-column
        sortable
        prop="discription"
        align="center"
        label="部门描述"
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon=" el-icon-edit"
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
      <el-form v-model="form" :key="timer">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" :label-width="formLabelWidth">
              <el-col>
                <el-select
                  style="width: 21.3rem"
                  clearable
                  v-model="form.director_name"
                  placeholder="选择负责人"
                  value-key="director_nickname"
                  ref="select_label"
                >
                  <el-option
                    v-for="item in user_list"
                    :value="item.director_name"
                    :label="item.director_nickname"
                    :key="item.id"
                    @click.native="
                      set_director_nickname(item.director_nickname)
                    "
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="部门说明" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  type="textarea"
                  size="large"
                  v-model="form.discription"
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
      timer: "",
      page_title: "部门管理",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      dialog_tile: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      form: {
        name: "",
        discription: "",
        director_name: "",
      },
      user_list: [],
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        name: "",
        director_name: "",
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
    // 获取组织机构列表
    getdata() {
      this.loading = true;
      let name = this.formInline.name;
      let director_name = this.formInline.director_name;
      // 模拟数据开始
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (name != "") {
        params.name = name;
      }
      if (!director_name && director_name != "") {
        params.director_name = director_name;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getOrganizationList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: params,
      })
        .then((response) => {
          this.listData = response.data.data.rows; //数据放入listdata
          this.pageparm.total = response.data.data.total; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm.currentPage = this.formInline.page_no;
      this.pageparm.pageSize = this.formInline.page_size;
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page_no = parm.currentPage;
      this.formInline.page_size = parm.pageSize;
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
        url: this.api.INTERFACES.getUserSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {
          id: row.id,
        },
        async: true,
      })
        .then((response) => {
          that.user_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });

      that.editFormVisible = true;
      that.dialog_tile = "编辑部门信息";
      that.form = row;
    },
    add_depart() {
      var that = this;
      this.$axios({
        method: "get",
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        url: this.api.INTERFACES.getUserSelectList,
        params: {},
        async: true,
      })
        .then((response) => {
          that.user_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      that.editFormVisible = true;
      that.dialog_tile = "新增部门信息";
      that.form = [];
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      console.log(this.form);
      let that = this;
      let data = that.form;
      if (that.form.id != null && that.form.id != "") {
        this.$confirm("是否保存组织机构信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.updateOrganizationInfo,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "组织机构信息修改成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "组织机构信息修改失败，请联系管理员",
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
        this.$confirm("是否保存你新建的组织机构信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.addOrganizationInfo,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "组织机构信息修改成功",
                  type: "success",
                  duration: 3000,
                });
                this.form.id = response.data.data;
              } else {
                this.$message({
                  message: "组织机构信息修改失败，请联系管理员",
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
    // 删除组织机构信息
    deleteDevice(index, row) {
      this.$confirm("确定删除该组织机构?", "消息提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.delOrganization,
            data: this.$qs.stringify({ id: row.id }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "组织机构信息s删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "组织机构信息修改失败，请联系管理员",
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
    //下拉列表设置nickname
    set_director_nickname(label) {
      this.form.director_nickname = label;
    },
    //
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