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
            <el-col :span="5">
              <el-input
                v-model="formInline.device_name"
                placeholder="请输入设备名"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="formInline.device_nickname"
                placeholder="请输入设备显示名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="formInline.organization_name"
                placeholder="输入出厂商家名称"
                clearable=""
              ></el-input>
            </el-col>
            <el-col inline="true" :span="9">
              <el-col :span="12">
                <el-select v-model="formInline.group_id" placeholder="分类筛选">
                  <el-option
                    v-for="item in group_list"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="formInline.group_value"
                  autocomplete="off"
                ></el-input>
              </el-col>
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
              add_device();
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
      <el-table-column sortable prop="device_nickname" label="设备显示名称">
      </el-table-column>
      <el-table-column sortable prop="device_name" label="设备名称">
      </el-table-column>
      <el-table-column sortable prop="device_master_name" label="责任人">
      </el-table-column>
      <el-table-column sortable prop="organization_name" label="出厂商家">
      </el-table-column>
      <el-table-column sortable prop="device_add_date" label="设备上架日期">
      </el-table-column>
      <el-table-column sortable prop="update_date" label="设备信息更新时间">
      </el-table-column>
      <!-- 
      <el-table-column sortable prop="switch_on" label="在线/离线">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.switch_on"
            class="switchStyle"
            :active-value="1"
            :inactive-value="0"
            active-text="在线"
            inactive-text="离线"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="change_switch(scope.row)"
          >
          </el-switch
        ></template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon=" el-icon-edit"
            size="mini"
            @click="
              editDevice(scope.$index, scope.row);
              dialogFormEdit = true;
            "
            >编辑</el-button
          >
          <!-- <el-button
            type="primary"
            size="mini"
            @click="
              transDevice(scope.$index, scope.row);
              dialogFormVisible = true;
            "
            >转发</el-button
          > -->
          <el-button
            size="mini"
            type="danger"
            @click="deleteDevice(scope.$index, scope.row)"
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
      <el-form v-model="editForm">
        <el-form-item label="设备显示名称" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-select
              style="width: 21.3rem"
              clearable
              v-model="editForm.productKey"
              placeholder="选择产品"
              :disabled="device_dis"
            >
              <el-option
                v-for="item in productList"
                :label="item.productName"
                :value="item.productKey"
                :key="item.productKey"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="设备显示名称" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-input
              v-model="editForm.device_nickname"
              autocomplete="off"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  v-model="editForm.device_name"
                  autocomplete="off"
                  :disabled="device_dis"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="出厂商家" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-select
              style="width: 21.3rem"
              clearable
              v-model="editForm.organization_id"
              placeholder="出厂商家"
            >
              <el-option
                v-for="item in organization_list"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主负责人" :label-width="formLabelWidth">
              <el-col>
                <el-select
                  style="width: 21.3rem"
                  clearable
                  v-model="editForm.device_master_id"
                  placeholder="选择负责人"
                >
                  <el-option
                    v-for="item in user_list"
                    :value="item.id"
                    :label="item.director_nickname"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="设备分类" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-select
              style="width: 21.3rem"
              clearable
              v-model="editForm.group_id"
              placeholder="按...分类"
            >
              <el-option
                v-for="item in group_list"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备所属类别值" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  v-model="editForm.group_value"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="信息更新时间" :label-width="formLabelWidth">
          <el-col :span="18">
            <span> {{ editForm.update_date }}</span>
          </el-col>
        </el-form-item>
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
      page_title: "设备基本信息管理",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      device_dis:false,
      title: "添加",
      editForm: {
        group_id: "",
        company_id: "",
        director_id: "",
        token: localStorage.getItem("logintoken"),
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,

      formLabelWidth: "120px",

      formInline: {
        page: 1,
        limit: 10,
        device_name: "",
        device_nickname: "",
        organization_name: "",
        group_id: "",
        group_value: "",
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
      organization_list: [],
      user_list: [],
      group_list: [],
      productList: [],
      dialog_tile: "",
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
      let that = this;
      let device_name = this.formInline.device_name;
      let device_nickname = this.formInline.device_nickname;
      let organization_name = this.formInline.organization_name;
      let group_id = this.formInline.group_id;
      let group_value = this.formInline.group_value;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      if (device_name != "") {
        params.device_name = device_name;
      }

      if (device_nickname != "") {
        params.device_nickname = device_nickname;
      }
      if (organization_name != "") {
        params.organization_name = organization_name;
      }
      if (group_value != "") {
        params.group_value = group_value;
      }
      if (group_id != "") {
        params.group_id = group_id;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceInfoList,
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
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getGroupSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.group_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
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
    editDevice: function (index, row) {
      this.dialog_tile = "编辑设备信息";
      let that = this;
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
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getProSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.productList = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });

      this.editForm = row;
      this.editForm.group_id = Number(row.group_id);
       this.device_dis=true;
    },
    transDevice(index, row) {
      this.form = row;
    },
    // 编辑、增加页面保存方法
    submitForm() {
      console.log(this.editForm);
      let that = this;
      let data = that.editForm;
      if (that.editForm.device_id != null && that.editForm.device_id != "") {
        this.$confirm("确定修改设备信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.updateDeviceInfo,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备信息修改成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "设备信息修改失败，请联系管理员",
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
        this.$confirm("是否保存你新建的设备信息?", "消息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.addDeviceInfo,
            data: this.$qs.stringify(data),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备信息添加成功",
                  type: "success",
                  duration: 3000,
                });
                this.form.id = response.data.data;
              } else {
                this.$message({
                  message: "设备信息添加失败，请联系管理员",
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
    deleteDevice(index, row) {
      this.$confirm("确定要将该设备移除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //移除设备
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.delDeviceInfo,
            data: this.$qs.stringify({ device_name: row.device_name }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "设备信息删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "设备信息删除失败",
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
    change_switch(row) {
      let switch_on_now = row.switch_on;
      let device_name = row.device_name;
      if (switch_on_now == 0) {
        switch_on_now = 1;
      } else {
        switch_on_now = 0;
      }

      this.$axios({
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        method: "post",
        url: this.api.INTERFACES.turnDevice,
        data: this.$qs.stringify({
          device_name: device_name,
          switch_on_now: switch_on_now,
        }),
        async: true,
      })
        .then((response) => {
          if (response.data.code == "200") {
            this.$message({
              message: "设备开关成功",
              type: "success",
              duration: 3000,
            });
            this.getdata();
          } else {
            this.$message({
              message: "设备信息删除失败",
              type: "error",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //显示添加界面
    add_device() {
      this.device_dis=false;
      this.dialog_tile = "新增设备信息";
      let that = this;
      this.editForm = [];
      this.editForm.update_date = "暂无";
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
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getUserSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
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
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getGroupSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.group_list = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getProSelectList,
        Headers: { "Content-Type": "application/json;charset=utf-8" },
        params: {},
        async: true,
      })
        .then((response) => {
          that.productList = response.data.data; //数据放入listdata
          that.timer = new Date().getTime();
        })
        .catch((error) => {
          console.log(error);
        });
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
.el-input {
  height: 100%;
}
</style>