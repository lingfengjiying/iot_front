<template>
  <div>
    <NavTop :page-title="page_title"></NavTop>

    <el-form :model="form">
      <el-row class="basic_info">
        <el-col :span="14">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.device_name }}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.device_id }}</span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出厂商家" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.organization_name }}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前温度" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.tempareture }}°</span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="当前湿度" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.humidity }}%</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新时间" :label-width="formLabelWidth">
                <el-col :span="12">
                  <span> {{ form.update_date }}</span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row></el-col
        >

        <el-col :span="10" aria-rowspan="3">
          <el-date-picker
            v-model="date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button type="primary" @click="initEcharts">刷新</el-button>
           <el-button type="primary" @click="return_to_list">返回上级页面</el-button>
        </el-col>
      </el-row>
      <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="更新人员id" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.update_person_id }}</span>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新人员名称" :label-width="formLabelWidth">
              <el-col :span="18">
                <span> {{ form.update_person }}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row> -->
    </el-form>
    <el-form>
      <el-row :gutter="23">
        <el-col :span="24" class="text-c">
          <div class="paybox">
            <div class="cavasbox" ref="temparetureEchart"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="23">
        <el-col :span="24" class="text-c">
          <div class="paybox">
            <div class="cavasbox" ref="humidityEchart"></div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import NavTop from "../../components/nav_top/nav_top.vue";
export default {
  data() {
    return {
      page_title: "数据详情",
      machineNo: "",
      type: "day",
      device_nickname: "",
      device_master_name: "",
      device_list: [],
      device_id: "",
      date: "",
      date_min: "",
      date_max: "",
      form: {},
      data_date: [],
      data_temp: [],
      data_hum: [],
      formLabelWidth: "80px",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  components: { NavTop },
  mounted() {
    this.form = this.$route.params.form;
    this.initEcharts();
  },
  // 里面的函数只有调用才会执行
  methods: {
    get_count_data() {
      console.log();
    },
    initEcharts() {
      let that = this;

      let params = {
        device_id: this.form.device_id,
      };
      that.data_date = [];
      that.data_temp = [];
      that.data_hum = [];
      let i = 0;
      if (this.date != "" && this.date != null) {
        this.date_min =
          this.date[0].getFullYear() +
          "-" +
          (this.date[0].getMonth() + 1) +
          "-" +
          this.date[0].getDate();
        this.date_max =
          this.date[1].getFullYear() +
          "-" +
          (this.date[1].getMonth() + 1) +
          "-" +
          this.date[1].getDate();
      }
      if (this.date != "" && this.date != null) {
        params.date_min = this.date_min;
        params.date_max = this.date_max;
      }
      let temp_chart = that.$echarts.init(this.$refs.temparetureEchart); //初始化温度chart
      let hum_chart = that.$echarts.init(this.$refs.humidityEchart); //初始化湿度chart

      let tempareture_option = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: "设备温度变化曲线图", //主标题文本，'\n'指定换行
        },
        xAxis: {
          name: "日期",
          nameLocation: "end", //坐标位置，支持start,end，middle
          type: "category",
          data: that.data_date,
        },
        yAxis: {
          name: "温度:(°)",
          nameLocation: "end", //坐标位置，支持start,end，middle
          type: "value",
        },
        series: [
          {
            data: that.data_temp,
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
          },
        ],
      };
      let humidity_option = {
        title: {
          show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
          text: "设备湿度变化曲线图", //主标题文本，'\n'指定换行
        },
        xAxis: {
          name: "日期",
          nameLocation: "end", //坐标位置，支持start,end，middle
          type: "category",
          data: that.data_date,
        },
        yAxis: {
          name: "湿度:(%)",
          nameLocation: "end", //坐标位置，支持start,end，middle
          type: "value",
        },
        series: [
          {
            name: "湿度",
            data: that.data_hum,
            type: "line",
            smooth: true,
            itemStyle: { normal: { label: { show: true } } },
          },
        ],
      };

      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDataHistory,
        params: params,
        async: false,
        //data: "",
      })
        .then((response) => {
        //   if (response.data.data.length <= 0) {
        //             this.$nextTick(()=>{
        //                 let dom1 =this.$refs.temparetureEchart;
        //                 let dom2 =this.$refs.temparetureEchart;
        //                 dom1.innerHTML("暂无数据");
        //                 dom2.innerHTML("暂无数据");
        //             })

        //   } else {
            for (i; i < response.data.data.length; i++) {
              that.data_date.push(response.data.data[i].date);
              that.data_temp.push(response.data.data[i].temp);
              that.data_hum.push(response.data.data[i].hum);
            }
            temp_chart.setOption(tempareture_option); //设置温度chart
            hum_chart.setOption(humidity_option); //设置湿度chart
        //   }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    return_to_list(){
       this.$router.push({
        name:'device_data_list',
       
      });
    }
  },
};
</script>
<style>
.stbox {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-top: 2rem;
}
.stbgc {
  background-color: #fff;
  height: 60px;
  line-height: 60px;
  border-radius: 5px;
  padding: 0px 16px;
}
.stsearch {
  text-align: center;
}
.text-c {
  text-align: center;
}
.st-gbox {
  background-color: #fff;
  margin-top: 20px;
  border-radius: 5px;
  height: 30vh;
  box-sizing: border-box;
  padding: 10px;
}
.cavasbox {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.paybox {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  margin-top: 20px;
  height: 32vh;
}
.search {
  margin-top: 2rem;
  position: relative;
  left: 90rem;
}
.search_1 {
  margin-top: 2rem;
  position: relative;
  left: 58rem;
}
.basic_info {
  margin-top: 5rem;
  background: #fff;
}
</style>

