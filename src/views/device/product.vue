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
            <el-col :span="8">
              <el-input
                v-model="formInline.productName"
                placeholder="请输入产品昵称"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="formInline.productValue"
                placeholder="输入产品名"
                clearable
              ></el-input>
            </el-col>

            <el-col :span="8">
              <el-input
                v-model="formInline.categoryName"
                placeholder="请输入产品品类名"
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
              add_product();
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
      <el-table-column sortable prop="productName" label="产品昵称">
      </el-table-column>
      <el-table-column sortable prop="productValue" label="产品名">
      </el-table-column>
      <el-table-column sortable prop="productId" label="产品id">
      </el-table-column>
      <el-table-column sortable prop="categoryName" label="品类名">
      </el-table-column>
      <el-table-column sortable prop="creatPersonName" label="创建人名称">
      </el-table-column>
      <el-table-column sortable prop="createDate" label="创建时间">
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
            >查看</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteProduct(scope.$index, scope.row)"
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
      <el-form :disabled="edit_dis" v-model="editForm">
        <el-form-item
          v-show="product_type_show"
          label="产品所属品类"
          :label-width="formLabelWidth"
        >
          <el-col :span="12">
            <el-radio-group
              v-model="editForm.product_type"
              @change="set_type_hidden"
            >
              <el-radio label="0">自定义品类</el-radio>
              <el-radio label="1">标准品类</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="product_cate_show"
          label="产品品类"
          :label-width="formLabelWidth"
        >
          <el-col :span="12">
            <el-col :span="18">
              <el-input
                v-model="editForm.categoryName"
                autocomplete="off"
              ></el-input>
            </el-col>
          </el-col>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth">
          <el-col :span="10">
            <el-select
              ref="select_product"
              v-model="editForm.categoryName"
              placeholder="请选择标准品类"
              v-show="select_product_hid"
              @focus.prevent="set_product"
            ></el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="产品昵称" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-input
              v-model="editForm.productName"
              autocomplete="off"
              :disabled="nick_name_edit"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <el-input
                  v-model="editForm.productValue"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="节点类型" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-select
              style="width: 21.3rem"
              clearable
              v-model="editForm.nodeType"
              placeholder="节点类型"
            >
              <el-option :value="0" label="直连设备"></el-option>
              <el-option :value="1" label="网关设备"></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据格式" :label-width="formLabelWidth">
              <el-col>
                <el-select
                  style="width: 21.3rem"
                  clearable
                  v-model="editForm.dataFormat"
                  placeholder="选择数据格式"
                >
                  <el-option
                    :value="1"
                    label="ICA 标准数据格式（Alink JSON"
                  ></el-option>
                  <el-option :value="0" label="透传/自定义"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="联网类型" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-select
              style="width: 21.3rem"
              clearable
              v-model="editForm.netType"
              placeholder="选择联网类型"
            >
              <el-option value="WIFI" label="WIFI"></el-option>
              <el-option
                value="CELLULAR"
                label="蜂窝（2G / 3G / 4G / 5G）"
              ></el-option>
              <el-option value="ETHERNET" label="以太网"></el-option>
              <!--暂时用不上的联网方式 <el-option value="LORA" label="LoRaWAN"></el-option> -->
              <el-option value="OTHER" label="其它"></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证方式" :label-width="formLabelWidth">
              <el-col>
                <el-select
                  style="width: 21.3rem"
                  clearable
                  v-model="editForm.authType"
                  placeholder="选择认证方式"
                >
                  <el-option value="secret" label="设备密钥"></el-option>
                  <el-option value="id2" label="ID²"></el-option>
                  <el-option value="x509" label="X.509证书"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="产品描述" :label-width="formLabelWidth">
          <el-col :span="24">
            <el-input
              v-model="editForm.description"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择您的产品品类"
      :close-on-click-modal="false"
      :inline="true"
      :visible.sync="innerVisible"
    >
      <div>
        <!--搜索筛选-->
        <el-form
          :inline="true"
          :model="formInline_product_list"
          class="user-search"
        >
          <el-form-item :inline="true">
            <el-row>
              <el-col :span="24">
                <el-input
                  v-model="formInline_product_list.search_name"
                  placeholder="输入查询的产品品类名"
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
              @click="search_produuct"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-form v-model="form">
        <el-table
          class="table-item"
          size="small"
          :data="
            listData_product_select.slice(
              (formInline_product_list.page - 1) *
                formInline_product_list.limit,
              formInline_product_list.limit * formInline_product_list.page
            )
          "
          highlight-current-row
          v-loading="loading"
          border
          element-loading-text="拼命加载中..."
          style="width: 100%"
        >
          <el-table-column align="center" type="selection" />
          <el-table-column sortable prop="categoryName" label="产品类别名称">
          </el-table-column>
          <el-table-column sortable prop="categoryKey" label="产品类别标识码">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="
                  select_product(scope.$index, scope.row);
                  dialogFormEdit = true;
                "
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          v-bind:child-msg="pageparm_product_list"
          @callFather="callFather_product_list"
        ></Pagination>
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
      page_title: "产品分类",
      input: "",
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      editForm: {
        product_type: "0",
        categoryKey: "",
        categoryName: "",
        //token: localStorage.getItem("logintoken"),
      },
      select_product_hid: false,
      edit_dis: false,
      nick_name_edit: false,
      dialog_tile: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormEdit: false,
      innerVisible: false,
      product_type_show: true, //控制品类选择显示/隐藏
      product_cate_show: true, //控制品类名称显示/隐藏
      organization_list: [],
      form: {},
      formLabelWidth: "120px",
      formInline: {
        page: 1,
        limit: 10,
        token: localStorage.getItem("logintoken"),
      },
      formInline_product_list: {
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
      listData_product_select: [], //用户权限分配表
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      pageparm_product_list: {
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
    // 获取产品列表
    getdata() {
      this.loading = true;
      let params = {
        page_no: this.formInline.page,
        page_size: this.formInline.limit,
      };
      let categoryName = this.formInline.categoryName;
      let productValue = this.formInline.productValue;
      let productName = this.formInline.productName;
      if (categoryName != "" && categoryName != null) {
        params.categoryName = categoryName;
      }
      if (productValue != "" && productValue != null) {
        params.productValue = productValue;
      }
      if (productName != "" && productName != null) {
        params.productName = productName;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getProductList,
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
    callFather(param) {
      this.formInline.page = param.currentPage;
      this.formInline.limit = param.pageSize;
      this.getdata(this.formInline);
    },
    callFather_product_list(param) {
      this.formInline_product_list.page = param.currentPage;
      this.formInline_product_list.limit = param.pageSize;
      this.getdata(this.formInline_product_list);
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline);
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      var that = this;

      that.editFormVisible = true;
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getSingleProduct,
        params: { productId: row.productId },
        data: "",
      })
        .then((response) => {
          this.editForm = response.data.data; //数据放入listdata
          this.editForm.nodeType = Number(response.data.data.nodeType);
          this.editForm.dataFormat = Number(response.data.data.dataFormat);
          this.product_type_show = false;
          this.product_cate_show = true;
          this.edit_dis = true;
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      that.dialog_tile = "编辑产品信息";
    },
    //显示添加用户界面
    add_product() {
      this.dialog_tile = "添加产品";
      this.edit_dis = false;
      this.product_type_show = true;
      this.product_cate_show = false;
      this.editForm=[];
      this.editForm.product_type = "0";
    },
    // 删除用户
    deleteProduct(index, row) {
      this.$confirm("确定删除该产品吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            Headers: { "Content-Type": "application/json;charset=utf-8" },
            method: "post",
            url: this.api.INTERFACES.delProduct,
            data: this.$qs.stringify({ productId: row.productId }),
            async: true,
          })
            .then((response) => {
              if (response.data.code == "200") {
                this.$message({
                  message: "产品信息删除成功",
                  type: "success",
                  duration: 3000,
                });

                this.getdata();
              } else {
                this.$message({
                  message: "产品信息删除失败，请联系管理员",
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
      let data = that.editForm;

      this.$confirm("是否保存你新建的产品?", "消息提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios({
          Headers: { "Content-Type": "application/json;charset=utf-8" },
          method: "post",
          url: this.api.INTERFACES.addProduct,
          data: this.$qs.stringify(data),
        })
          .then((response) => {
            if (response.data.code == "200") {
              this.$message({
                message: "产品添加成功",
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
    },
    set_type_hidden() {
      let that = this;
      if (that.editForm.product_type == "1") {
        that.select_product_hid = true;
      } else {
        that.select_product_hid = false;
      }
    },
    //设置品类
    set_product() {
      this.innerVisible = true;
      //this.formInline_product_list.search_name = "";
      this.search_produuct();
    },
    //查询品类
    search_produuct() {
      this.loading = true;
      let params = {
        page_no: this.formInline_product_list.page,
        page_size: this.formInline_product_list.limit,
      };
      let search_name = this.formInline_product_list.search_name;
      if (search_name != "" && search_name != null) {
        params.search_name = search_name;
      }
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getProductSelectList,
        params: params,
        data: "",
      })
        .then((response) => {
          this.listData_product_select = response.data.data; //数据放入listdata
          this.pageparm_product_list.total = response.data.data.length; //长度
        })
        .catch((error) => {
          console.log(error);
        });
      this.loading = false;
      this.pageparm_product_list.currentPage =
        this.formInline_product_list.page;
      this.pageparm_product_list.pageSize = this.formInline_product_list.limit;
    },
    //选择产品品类
    select_product(index, row) {
      this.innerVisible = false;
      this.editForm.categoryName = row.categoryName;
      this.editForm.categoryKey = row.categoryKey;
      // this.$refs['select_product'].selectedLabel= row.categoryName;
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