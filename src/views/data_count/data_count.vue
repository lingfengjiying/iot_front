<template>
  <div>
    <NavTop :page-title="page_title"></NavTop>
  
        <el-form>
          <el-row class="search">
            <el-col :span="11">
              <div class="stbgc">
                <el-row :gutter="23">
                  <el-col :span="7">
                    <el-input
                     
                      v-model="device_master_name"
                      placeholder="查询设备所属公司"
                    ></el-input>
                  </el-col>
                  <el-col :span="7">
                    <el-input
                      
                      v-model="device_nickname"
                      placeholder="查询设备名"
                    ></el-input>
                  </el-col>
                  <el-col :span="3" class="stsearch">
                    <el-button
                    
                      type="primary"
                      @click="search_device"
                      >搜索设备</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row class="search_1">
            <el-col :span="20">
              <div class="stbgc">
                <el-row>
                  <el-col :span="7">
                    <el-select
                      style="width: 21.3rem"
                      clearable
                      v-model="device_id"
                      placeholder="请选择设备"
                    >
                      <el-option
                        v-for="item in device_list"
                        :label="item.device_nickname"
                        :value="item.device_id"
                        :key="item.device_id"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
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
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      size="small"
                      type="primary"
                      @click="get_count_data"
                      >显示统计信息</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-form>
      <!-- 统计图 -->
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
      page_title: "数据统计",
      machineNo: "",
      type: "day",
      device_nickname: "",
      device_master_name: "",
      device_list: [],
      device_id: "",
      date: "",
      date_min: "",
      date_max: "",
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
      //温度曲线图

      //湿度曲线图

      //  销售总笔数
    };
  },
  components: { NavTop },
  // 挂载结束状态(里面是操作)
  mounted() {
    this.set_data();
  },
  // 里面的函数只有调用才会执行
  methods: {
    // 交易总笔数

    // 支付方式统计
    set_data() {
      let i = 0;
      let data_date = [];
      let data_temp = [];
      let data_hum = [];
      let temp_chart = this.$echarts.init(this.$refs.temparetureEchart); //初始化温度chart
      let hum_chart = this.$echarts.init(this.$refs.humidityEchart); //初始化湿度chart
      if (this.device_id != "") {
        let params = {
          device_id: this.device_id,
        };
        if (this.date != "" && this.date != null) {
          params.date_min = this.date_min;
          params.date_max = this.date_max;
        }
        this.$axios({
          method: "get",
          url: this.api.INTERFACES.getDataHistory,
          params: params,
          //data: "",
        })
          .then((response) => {
            for (i; i < response.data.data.length; i++) {
              data_date.push(response.data.data[i].date);
              data_temp.push(response.data.data[i].temp);
              data_hum.push(response.data.data[i].hum);
            }
            let tempareture_option = {
              title: {
                show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
                text: "设备温度变化曲线图", //主标题文本，'\n'指定换行
              },
              xAxis: {
                name: "日期",
                nameLocation: "end", //坐标位置，支持start,end，middle
                type: "category",
                data: data_date,
              },
              yAxis: {
                name: "温度:(°)",
                nameLocation: "end", //坐标位置，支持start,end，middle
                type: "value",
              },
              series: [
                {
                  data: data_temp,
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
                data: data_date,
              },
              yAxis: {
                name: "湿度:(%)",
                nameLocation: "end", //坐标位置，支持start,end，middle
                type: "value",
              },
              series: [
                {
                  name: "湿度",
                  data: data_hum,
                  type: "line",
                  smooth: true,
                  itemStyle: { normal: { label: { show: true } } },
                },
              ],
            };
            temp_chart.setOption(tempareture_option); //设置温度chart
            hum_chart.setOption(humidity_option); //设置湿度chart
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let tempareture_option = {
          title: {
            show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
            text: "设备温度变化曲线图", //主标题文本，'\n'指定换行
          },
          xAxis: {
            name: "日期",
            nameLocation: "end", //坐标位置，支持start,end，middle
            type: "category",
            data: [],
          },
          yAxis: {
            name: "温度:(°)",
            nameLocation: "end", //坐标位置，支持start,end，middle
            type: "value",
          },
          series: [
            {
              data: [],
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
            data: [],
          },
          yAxis: {
            name: "湿度:(%)",
            nameLocation: "end", //坐标位置，支持start,end，middle
            type: "value",
          },
          series: [
            {
              name: "湿度",
              data: [],
              type: "line",
              smooth: true,
              itemStyle: { normal: { label: { show: true } } },
            },
          ],
        };

        temp_chart.setOption(tempareture_option); //设置温度chart

        hum_chart.setOption(humidity_option); //设置湿度chart
      }
    },
    // 设备选择
    search_device() {
      let device_nickname = this.device_nickname;
      let device_master_name = this.device_master_name;
      let params = {
        device_nickname: device_nickname,
        device_master_name: device_master_name,
      };
      this.$axios({
        method: "get",
        url: this.api.INTERFACES.getDeviceSelect,
        params: params,
        data: "",
      })
        .then((response) => {
          this.device_list = response.data.data; //数据放入listdata
        })
        .catch((error) => {
          console.log(error);
        });
    },
    get_count_data() {
      if (this.device_id == "") {
        this.$message({
          message: "请先查询和选择设备",
          type: "error",
          duration: 3000,
        });
      } else {
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

        this.set_data();
      }
    },
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
</style>

