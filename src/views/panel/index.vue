<template>
  <div class="app-container">
    <div class="app-container-inner">
      <!-- Header start ------------------------- -->
      <el-row>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #b7bace">
              <el-icon size="20"><Select /></el-icon>
            </div>
            <div class="text">
              <div class="top-text">已解决</div>
              <div class="bottom-text">{{ yjj }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #aec9de">
              <el-icon size="20">
                <CloseBold />
              </el-icon>
            </div>
            <div class="text">
              <div class="top-text">未解决</div>
              <div class="bottom-text">{{ wjj }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #f6e1c0">
              <el-icon size="20">
                <Iphone />
              </el-icon>
            </div>
            <div class="text">
              <div class="top-text">移动浏览器</div>
              <div class="bottom-text">{{ ydllq }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #d4d2fb">
              <el-icon size="20">
                <Monitor />
              </el-icon>
            </div>
            <div class="text">
              <div class="top-text">web浏览器</div>
              <div class="bottom-text">{{ webllq }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- Header end ------------------------- -->
      <el-divider />
      <!-- middle start ------------------------ -->
      <el-row>
        <el-col :span="16">
          <div style="height: 70vh; padding: 10px 0px">
            <div id="myOnlyLine" style="width: 96%; margin: 0 auto; height: 96%; border-radius: 15px; padding-top: 10px"> </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="height: 65vh; transform: translateY(-6px)">
            <div
              v-for="(item, index) in rightData"
              :style="{
                height: 65 / rightData.length + 'vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                border: '#ededf3 solid 1px',
              }"
            >
              <span style="color: #b3b5c3; margin-bottom: 8px">{{ item.name }}</span>

              <span style="font-size: 20px; font-weight: 600">{{ item.value }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- middle end -------------------------- -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import china from '@/assets/china.json'
  import * as echarts from 'echarts'
  import service from '@/api/request'
  import dayjs from 'dayjs'
  onMounted(() => {
    loadAPI()
  })

  let rightData = ref([])
  const loadAPI = () => {
    getHeaderData()
    getLineData()
    getTop5Data()
  }
  // Header start ----------------------
  let yjj = ref('60')
  let wjj = ref('100')
  let ydllq = ref('30')
  let webllq = ref('20')
  const getHeaderData = async () => {
    const { data: res } = await service.get('/ManageApi/v1/get_dashboard_header')
    yjj.value = res.data.question_resolved
    wjj.value = res.data.question_unresolved
    ydllq.value = res.data.mobile_num
    webllq.value = res.data.web_num
  }
  const getLineData = async () => {
    const { data: res } = await service.get('/ManageApi/v1/get_dashboard_trend')
    console.log(res.data)
    // 按日期从小到大排序
    res.data.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
    // 分离日期和数量
    const dates = res.data.map((item) => item.date)
    const nums = res.data.map((item) => item.num)
    drawOnlyLine(dates, nums)
  }
  const getTop5Data = async () => {
    const { data: res } = await service.get('/ManageApi/v1/get_dashboard_types')
    let result = []
    // 遍历对象的键值对
    for (const [key, value] of Object.entries(res.data)) {
      // 将每个键值对转换为{name: xxx, value: xx}形式的对象，并添加到结果数组中
      result.push({ name: key, value: value })
    }
    console.log(result)
    rightData.value = result
  }
  // Header end ------------------------

  // middle start ------------------------
  function drawOnlyLine(xData, yData) {
    if (document.getElementById('myOnlyLine') == null) {
      return
    }
    echarts.dispose(document.getElementById('myOnlyLine'))
    const myChart = echarts.init(document.getElementById('myOnlyLine'))
    let option = {
      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      title: {
        text: '本月问题提交数量变化',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: ['已解决', '未解决'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '已解决',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(128, 255, 165)',
              },
              {
                offset: 1,
                color: 'rgb(1, 191, 236)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: yData,
        },
        // {
        //   name: '未解决',
        //   type: 'line',
        //   stack: 'Total',
        //   smooth: true,
        //   lineStyle: {
        //     width: 0
        //   },
        //   showSymbol: false,
        //   areaStyle: {
        //     opacity: 0.8,
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //       {
        //         offset: 0,
        //         color: 'rgb(0, 221, 255)'
        //       },
        //       {
        //         offset: 1,
        //         color: 'rgb(77, 119, 255)'
        //       }
        //     ])
        //   },
        //   emphasis: {
        //     focus: 'series'
        //   },
        //   data: [120, 282, 111, 234, 220, 340, 310]
        // },
      ],
    }
    option && myChart.setOption(option)
  }

  // middle end --------------------------
</script>
<style lang="scss" scoped>
  // Header start ----------------------
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    padding: 8px 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    /* 添加阴影样式 */
  }

  .circle {
    width: 50px;
    height: 50px;
    // background-color: #b7bace;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    margin-left: 20px;
    /* 可以根据需要调整间距 */
  }

  .top-text {
    font-size: 12px;
    color: #79797b;
  }

  .bottom-text {
    font-size: 24px;
  }

  // Header end ------------------------

  .el-divider--horizontal {
    margin-top: 16px;
    margin-bottom: 4px;
  }
</style>
