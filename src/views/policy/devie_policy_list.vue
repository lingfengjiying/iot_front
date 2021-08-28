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
            <el-col :span="6">
              <el-input
                v-model="formInline.device_name"
                placeholder="请输入设备名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="formInline.device_id"
                placeholder="请输入设备id"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="formInline.policy_name"
                placeholder="请输入策略名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="6">
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
      <el-table-column sortable prop="device_name" label="设备名称">
      </el-table-column>
      <el-table-column sortable prop="device_id" label="设备代码">
      </el-table-column>
      <el-table-column sortable prop="policy_name" label="策略名称">
      </el-table-column>
      <el-table-column sortable prop="policy_code" label="策略代码">
      </el-table-column>
      <el-table-column sortable prop="update_user_nickname" label="修改人">
      </el-table-column>
      <el-table-column sortable prop="update_user_id" label="修改人账户">
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
      :title="dialog_title"
      :visible.sync="dialogFormEdit"
    >
      <el-form v-model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  disabled="true"
                  v-model="form.device_name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备代码" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  disabled="true"
                  v-model="form.device_id"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择策略" :label-width="formLabelWidth">
              <el-col>
                <el-select
                  :disabled="edit"
                  style="width: 21.3rem"
                  clearable
                  v-model="form.policy_code"
                  placeholder="请选择设备策略"
                  @change="change_form"
                >
                  <el-option
                    v-for="item in policy_list"
                    :label="item.policy_name"
                    :value="item.policy_code"
                    :key="item.policy_name"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="策略描述" :label-width="formLabelWidth">
              <el-col :span="18">
                <span>{{ form.policy_descri }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
      page_title: "设备策略管理",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      dialog_title: "",
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
      form: { policy_code: "" },
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
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
      policy_list: [],
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
    this.get_policy_list();
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    change_form(policy_code) {
      let item;
      for (item in this.policy_list) {
        if (this.policy_list[item].policy_code == policy_code) {
          this.form.policy_descri = this.policy_list[item].policy_descri;
        } else {
          this.form.policy_descri = "";
        }
      }
    },
    // 获取设备策略列表
    getdata() {
      this.loading = true;
      let device_name = this.formInline.device_name;
      let device_id = this.formInline.device_id;
      let policy_name = this.formInline.policy_name;
      let policy_code = this.formInline.policy_code;

      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (device_name != "") {
        params.device_name = device_name;
      }
      if (device_id != "") {
        params.device_id = device_id;
      }
      if (policy_name != "") {
        params.policy_name = policy_name;
      }
      if (policy_code != "") {
        params.policy_code = policy_code;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDevicePolicyList,
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
      let that = this;
      this.editFormVisible = true;
      this.dialog_title = "编辑设备策略";

      this.edit = false;
      this.form = row;
      this.change_form(this.form.policy_code); //输出：修改后的值
    },
    get_policy_list() {
      let that = this;
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getPolicySelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        async: true,
      })
        .then((response) => {
          this.policy_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查看设备策略详情
    view(index, row) {
      this.editFormVisible = true;
      this.dialog_title = "查看策略详情";
      this.form = row;
      this.edit = true;
      this.change_form(this.form.policy_code); //输出：修改后的值
    },
    // 编辑、增加页面保存方法
    submitForm() {
      let data = this.form;
      this.$confirm("是否保存策略信息?", "消息提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.updateDevicePolicy,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备策略信息更新成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "设备策略信息更新失败，请联系管理员",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: "取消保存策略信息",
                type: "error",
                duration: 3000,
              });
            });
        })
        .catch(() => {
          this.$message({
            message: "已取消修改",
            type: "error",
            duration: 3000,
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