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
                v-model="formInline.deptName"
                size="small"
                placeholder="请输入设备名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="formInline.deptName"
                size="small"
                placeholder="输入公司名称"
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
      <el-table-column sortable prop="device_name" label="设备名">
      </el-table-column>
      <el-table-column sortable prop="device_id" label="设备编号">
      </el-table-column>
      <el-table-column sortable prop="device_depart" label="所属公司/个人">
      </el-table-column>
      <el-table-column sortable prop="catch_statu" label="异常状态">
      </el-table-column>
      <el-table-column sortable prop="catch_reson" label="异常原因">
      </el-table-column>
      <el-table-column
        sortable
        prop="editTime"
        align="center"
        label="设备信息更新时间"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.editTime | timestampToTime }}</div>
        </template>
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
      title="异常设备详情"
      :visible.sync="dialogFormEdit"
    >
      <el-form v-model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.device_name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.device_id"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.device_depart"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.editTime"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电流" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电压" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.voltage"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功率" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用电量" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.name"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="异常状态" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.catch_statu"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常原因" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  :disabled="true"
                  v-model="form.catch_reson"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import NavTop from "../../components/nav_top/nav_top.vue";
import Pagination from "../../components/pagination/pagination.vue";

export default {
  data() {
    return {
      page_title: "异常设备列表",
      input: "",
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        deptId: "",
        deptName: "",
        deptNo: "",
        token: localStorage.getItem("logintoken"),
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        varLable: "",
        varName: "",
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
    clear_data() {
      this.listData = [];
    },
    // 获取异常设备列表
    getdata() {
      this.loading = true;
      // 模拟数据开始
      let res = {
        code: 0,
        msg: null,
        count: 5
      };
      this.$axios({
        method: "get",
        url: "/mock/data.json",
        data: "",
      })
        .then((response) => {
          this.listData = response.data.device_catch_list; //将模拟数据放入listdata
          this.pageparm.total = response.data.device_catch_list.length; //长度
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
      this.form = row;
      console.log(this.from);
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
      this.getdata(); //关闭以后刷新数据
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