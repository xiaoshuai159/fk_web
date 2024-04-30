<template>
  <div class="app-container">
    <div class="blockstyle">
      <div class="titlestyle" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0px 10px 24px">
        <div>
          <span>交易软件活跃情况</span>
        </div>
        <div style="margin-right: 20px; font-weight: normal">
          <span>时间范围：</span>
          <el-select v-model="timeValue" placeholder="请选择" style="width: 100px; margin-right: 30px">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <span>日期选择：</span>
          <el-date-picker
            v-model="datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <div style="width: 20%; display: inline-block">
          <div class="namestyle">买币人数</div>
          <div class="numberstyle">{{ mbrs1 }}</div>
        </div>
        <div style="width: 20%; display: inline-block">
          <div class="namestyle">卖币人数</div>
          <div class="numberstyle">{{ mbrs2 }}</div>
        </div>
        <div style="width: 20%; display: inline-block">
          <div class="namestyle">买入量（USDT）</div>
          <div class="numberstyle">{{ mrl }}</div>
        </div>
        <div style="width: 20%; display: inline-block">
          <div class="namestyle">卖出量（USDT）</div>
          <div class="numberstyle">{{ mcl }}</div>
        </div>
        <div style="width: 20%; display: inline-block">
          <div class="namestyle">监测卡号</div>
          <div class="numberstyle">{{ jckh }}</div>
        </div>
      </div>
    </div>
    <div class="blockstyle">
      <div class="titlestyle">
        <span>买卖币种占比</span>
      </div>
      <div style="width: 50%; height: 350px; padding: 10px 0px; display: inline-block">
        <div
          id="myPieChart1"
          style="width: 80%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
        >
        </div>
      </div>
      <div style="width: 50%; height: 350px; padding: 10px 0px; display: inline-block">
        <div
          id="myPieChart2"
          style="width: 80%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
        >
        </div>
      </div>
    </div>
    <div style="width: 98%; margin: 0 auto; margin-bottom: 20px; border-radius: 4px">
      <div class="blockstyle1" style="margin-right: 1%">
        <div class="titlestyle">
          <span>买入买家TOP5</span>
        </div>
        <div style="height: 300px; padding: 10px 0px">
          <div style="width: 94%; margin: 0 auto">
            <el-table :data="buytableData">
              <el-table-column prop="nickname" label="用户昵称" width="180" align="center"> </el-table-column>
              <el-table-column prop="area" label="归属地" width="180" align="center"> </el-table-column>
              <el-table-column prop="num" label="买入量" align="center"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="blockstyle1" style="margin-left: 1%">
        <div class="titlestyle">
          <span>卖出卖家TOP5</span>
        </div>
        <div style="height: 300px; padding: 10px 0px">
          <div style="width: 94%; margin: 0 auto">
            <el-table :data="selltableData">
              <el-table-column prop="nickname" label="用户昵称" width="180" align="center"> </el-table-column>
              <el-table-column prop="area" label="归属地" width="180" align="center"> </el-table-column>
              <el-table-column prop="num" label="卖出量" align="center"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue'
  import { onMounted } from 'vue'
  import * as echarts from 'echarts'
  import dayjs from 'dayjs'
  import service from '@/api/request'
  //日期下拉框和日期时间选择器
  const getPastDate = (days) => {
    const today = new Date()
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - days)
    return pastDate
  }
  //日期下拉框和日期时间选择器
  const timeValue = ref(1)
  const datetime = ref([])
  const pastDate = getPastDate(7)
  datetime.value = [pastDate, new Date()]
  const timeOptions = ref([
    { value: 1, label: '周' },
    { value: 2, label: '月' },
    { value: 3, label: '季度' },
  ])
  watch(datetime, (newValue, oldValue) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const currentDay = currentDate.getDate()

    if (
      newValue[1].getFullYear() === currentYear &&
      newValue[1].getMonth() === currentMonth &&
      newValue[1].getDate() === currentDay &&
      newValue[0].getFullYear() === getPastDate(7).getFullYear() &&
      newValue[0].getMonth() === getPastDate(7).getMonth() &&
      newValue[0].getDate() === getPastDate(7).getDate()
    ) {
      timeValue.value = 1
    } else if (
      newValue[1].getFullYear() === currentYear &&
      newValue[1].getMonth() === currentMonth &&
      newValue[1].getDate() === currentDay &&
      newValue[0].getFullYear() === getPastDate(30).getFullYear() &&
      newValue[0].getMonth() === getPastDate(30).getMonth() &&
      newValue[0].getDate() === getPastDate(30).getDate()
    ) {
      timeValue.value = 2
    } else if (
      newValue[1].getFullYear() === currentYear &&
      newValue[1].getMonth() === currentMonth &&
      newValue[1].getDate() === currentDay &&
      newValue[0].getFullYear() === getPastDate(90).getFullYear() &&
      newValue[0].getMonth() === getPastDate(90).getMonth() &&
      newValue[0].getDate() === getPastDate(90).getDate()
    ) {
      timeValue.value = 3
    } else {
      timeValue.value = null
    }
    // console.log('datetime变了')
    loadAPI()
  })

  watch(timeValue, (newValue, oldValue) => {
    if (newValue === 1) {
      datetime.value = [getPastDate(7), new Date()]
    } else if (newValue === 2) {
      datetime.value = [getPastDate(30), new Date()]
    } else if (newValue === 3) {
      datetime.value = [getPastDate(90), new Date()]
    }
  })
  const mbrs1 = ref('2,1341')
  const mbrs2 = ref('3,2123')
  const mrl = ref('125,401,23')
  const mcl = ref('115,401,23')
  const jckh = ref('850,000')

  let buytableData = ref([])
  let selltableData = ref([])

  function drawPiechart1(walletData) {
    if (document.getElementById('myPieChart1') == null) {
      return
    }
    echarts.dispose(document.getElementById('myPieChart1'))
    const pie_chart1 = echarts.init(document.getElementById('myPieChart1'))
    let option = {
      title: {
        subtext: '买入币种占比',
        top: '-3%',
        left: '3%',
        subtextStyle: {
          fontSize: 14, // 设置副标题字体大小
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '14%',
        orient: 'vertical',
        right: 'right',
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: walletData,
        },
      ],
    }
    option && pie_chart1.setOption(option)
  }

  function drawPiechart2(walletData) {
    if (document.getElementById('myPieChart2') == null) {
      return
    }
    echarts.dispose(document.getElementById('myPieChart2'))
    const pie_chart2 = echarts.init(document.getElementById('myPieChart2'))
    // let pie_chart = this.$echarts.init(this.$refs.myPieChart1)
    let option = {
      title: {
        subtext: '卖出币种占比',
        top: '-3%',
        left: '3%',
        subtextStyle: {
          fontSize: 14, // 设置副标题字体大小
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '14%',
        orient: 'vertical',
        right: 'right',
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: walletData,
        },
      ],
    }
    option && pie_chart2.setOption(option)
  }
  //获取数据
  const loadAPI = async () => {
    const { data: res } = await service.get('/api/v1/get_exchange_header', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (res.code == 200) {
      // console.log(res);
      ;(mbrs1.value = res.data.buyers_num),
        (mbrs2.value = res.data.sellers_num),
        (mrl.value = res.data.buy_num),
        (mcl.value = res.data.sell_num),
        (jckh.value = res.data.cards_num)
    }
    const { data: resPie } = await service.get('/api/v1/get_exchange_coins', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (resPie.code == 200) {
      const buyerArray = Object.entries(resPie.data.buyer).map(([name, value]) => ({
        value,
        name,
      }))
      // 拆分exchange对象为数组
      const sellerArray = Object.entries(resPie.data.seller).map(([name, value]) => ({
        value,
        name,
      }))
      drawPiechart1(buyerArray)
      drawPiechart2(sellerArray)
    }
    const { data: tableData } = await service.get('/api/v1/get_exchange_top', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (tableData.code == 200) {
      buytableData.value = tableData.data.buyer
      selltableData.value = tableData.data.seller
    }
  }
  onMounted(() => {
    loadAPI()
  })
</script>
<style>
  .blockstyle {
    width: 98%;
    margin: 0 auto;
    background-color: #ffffff;
    margin-bottom: 20px;
    border-radius: 4px;
    /* height: 300px; */
  }

  .blockstyle1 {
    width: 49%;
    margin: 0 auto;
    background-color: #ffffff;
    margin-bottom: 20px;
    border-radius: 4px;
    display: inline-block;
  }

  .titlestyle {
    font-size: 16px;
    font-weight: 600;
    padding: 18px 0px 18px 24px;
    border-bottom: 1px solid #ebebeb;
  }

  .namestyle {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    padding: 24px 32px 4px 32px;
    color: rgba(0, 0, 0, 0.427450980392157);
  }

  .numberstyle {
    text-align: center;
    font-weight: 400;
    font-size: 20px;
    padding: 4px 32px 32px 32px;
    color: rgba(0, 0, 0, 0.847058823529412);
  }

  .usergraph {
    width: 46%;
    display: inline-block;
    margin: 0 auto;
    border-radius: 10px;
    border: 1px solid blue;
    margin: 0px 2%;
  }
</style>
<style scoped lang="scss">
  :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
    height: 50px !important;
  }
</style>
