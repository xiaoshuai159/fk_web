<template>
  <div class="app-container product">
    <div class="blockstyle">
      <div class="titlestyle" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0px 10px 24px">
        <div>
          <span>境内挖矿活动基础情况</span>
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
        <el-row>
          <el-col :span="6">
            <div class="namestyle">矿工IP日活数</div>
            <div class="numberstyle">{{ kgiprhs }}</div>
          </el-col>
          <el-col :span="6">
            <div class="namestyle">矿机数量</div>
            <div class="numberstyle">{{ kjsl }}</div>
          </el-col>
          <el-col :span="6">
            <div class="namestyle">矿池IP日活数</div>
            <div class="numberstyle">{{ kciprhs }}</div>
          </el-col>
          <el-col :span="6">
            <div class="namestyle">账号/地址数量</div>
            <div class="numberstyle">{{ zhdzsl }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="blockstyle">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分布情况统计" name="first" class="first-tab"></el-tab-pane>
        <el-tab-pane label="账号监测分析" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <div id="showfbqktj1">
      <div style="width: 98%; margin: 0 auto; margin-bottom: 20px; border-radius: 4px">
        <div class="blockstyle1" style="margin-right: 1%">
          <div class="titlestyle">
            <span>币种分布情况</span>
          </div>
          <div style="height: 300px; padding: 10px 0px">
            <div
              id="myhistogram1"
              style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
            >
            </div>
          </div>
        </div>
        <div class="blockstyle1" style="margin-left: 1%">
          <div class="titlestyle">
            <span>大矿工TOP5</span>
          </div>
          <div style="height: 300px; padding: 10px 0px">
            <div style="width: 94%; margin: 0 auto">
              <el-table :data="selltableData">
                <el-table-column prop="ip" label="矿工IP" width="180" align="center"> </el-table-column>
                <el-table-column prop="coin" label="币种" width="180" align="center"> </el-table-column>
                <el-table-column prop="num" label="矿机数" align="center"> </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <div class="blockstyle">
        <div class="titlestyle">
          <span>IP地域分布情况</span>
        </div>
        <div style="height: 350px; padding: 10px 0px">
          <div
            id="myhistogram2"
            style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
          >
          </div>
        </div>
      </div>
    </div>
    <div id="showfbqktj2" style="display: none">
      <div class="blockstyle">
        <div style="width: 80%; margin: 0px auto; padding: 20px 0px">
          <el-form ref="selectForm" :inline="true">
            <el-row>
              <el-col :span="7">
                <el-form-item label="挖矿钱包/账号:">
                  <el-input v-model="account" placeholder="请输入关键字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="关联IP:">
                  <el-input v-model="associatedIP" placeholder="请输入关键字"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="币种:">
                  <el-select v-model="currency" placeholder="请选择币种">
                    <el-option v-for="item in potOpt" :key="item.key" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div style="display: flex; justify-content: flex-end">
                  <el-button type="primary" @click="searchForm">查询</el-button>
                  <el-button type="info" @click="resetForm">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="width: 80%; margin: 0 auto">
          <el-table
            ref="multipleTable"
            :data="multipletableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
            tooltip-effect="dark"
            style="width: 100%"
            :row-style="{ height: '45px' }"
            :header-row-style="{ height: '38px' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="account" label="挖矿钱包/账号" min-width="320" align="center"> </el-table-column>
            <el-table-column prop="ip" label="关联IP" min-width="160" align="center"> </el-table-column>
            <el-table-column prop="num" label="矿机数" min-width="80" align="center"> </el-table-column>
            <el-table-column
              prop="coin"
              label="币种"
              show-overflow-tooltip
              sortable
              min-width="80"
              align="center"
              :sort-by="sortColumn"
              @sort-change="handleSortChange"
            >
            </el-table-column>
          </el-table>
          <div style="padding: 30px 0">
            <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)"
              >共 {{ multipletableData.length }} 条记录，第 {{ currentPage }} / {{ Math.ceil(multipletableData.length / pageSize) }} 页</div
            >
            <div style="display: flex; justify-content: right; margin-top: -24px">
              <el-pagination
                background
                :current-page="currentPage"
                :page-size="pageSize"
                layout=" prev, pager, next, jumper"
                :total="multipletableData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, reactive, watch } from 'vue'
  import service from '@/api/request'
  import dayjs from 'dayjs'
  import { onMounted } from 'vue'
  import * as echarts from 'echarts'

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
    searchForm()
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
  //交易软件活跃情况
  const kgiprhs = ref('1,2454')
  const kjsl = ref('32,4124')
  const kciprhs = ref('1,254')
  const zhdzsl = ref('')
  //定义查询框
  const account = ref('')
  const associatedIP = ref('')
  const currency = ref('')
  const resetForm = () => {
    account.value = ''
    associatedIP.value = ''
    currency.value = ''
  }
  let potOpt = ref([])
  // const selectForm = reactive({
  //   account: '',
  //   associatedIP: '',
  //   currency: '',
  // })

  //查询接口
  const searchForm = async () => {
    let list = {
      s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
      e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      account: account.value,
      ip: associatedIP.value,
      coin_type: currency.value,
    }
    const { data: res } = await service.get('/api/v1/get_mining_account', { params: list })
    if (res.code == 200) {
      // 更新挖矿钱包表格
      multipletableData.value = res.data
      potOpt.value = Array.from(new Set(res.data.map((item) => item.coin))).map((coin) => ({ label: coin, value: coin }))
    } else {
      console.error('Error fetching data:')
    }
  }

  let selltableData = ref([])

  //多选表单数据
  const multipletableData = ref([])
  const multipleSelection = ref([])
  // const toggleSelection(rows) {
  //   if (rows) {
  //     rows.forEach(row => {
  //       this.$refs.multipleTable.toggleRowSelection(row);
  //     });
  //   } else {
  //     this.$refs.multipleTable.clearSelection();
  //   }
  // }
  const sortColumn = ref('')
  const sortOrder = ref('')
  const handleSortChange = (prop, order) => {
    sortColumn.value = prop
    sortOrder.value = order
    if (order === 'ascending' || order === 'descending') {
      // 应用自定义排序函数
      this.multipleTable.sort(customSort)
    }
  }
  // 自定义排序函数
  const customSort = (a, b) => {
    const aValue = a.bname.toUpperCase() // 获取币种名称并转换为大写
    const bValue = b.bname.toUpperCase()
    if (this.sortOrder === 'ascending') {
      return aValue.localeCompare(bValue) // 升序排序
    } else {
      return bValue.localeCompare(aValue) // 降序排序
    }
  }

  function handleSelectionChange(val) {
    multipleSelection.value = val
  }
  const currentPage = ref(1) //当前页码
  const pageSize = ref(10) //每页最大条数
  //改变页面大小
  function handleSizeChange(val) {
    pageSize.value = val
  }
  //改变页码
  function handleCurrentChange(val) {
    currentPage.value = val
  }
  function drawHistogram1(xdate, kgipsdate, kjsdate) {
    if (document.getElementById('myhistogram1') == null) {
      return
    }
    echarts.dispose(document.getElementById('myhistogram1'))
    const myChart = echarts.init(document.getElementById('myhistogram1'))
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross', // 将type设置为'cross'
          label: {
            backgroundColor: '#6e7079',
          },
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xdate,
      },
      yAxis: {
        type: 'value',
        name: '个',
        boundaryGap: [0, 0.01],
      },
      series: [
        {
          name: '矿工IP数',
          type: 'bar',
          data: kgipsdate,
        },
        {
          name: '矿机数',
          type: 'bar',
          data: kjsdate,
        },
      ],
    }
    option && myChart.setOption(option)
  }

  function drawHistogram2(shengfendate, kgipsdate2, kjsdate2) {
    if (document.getElementById('myhistogram2') == null) {
      return
    }
    echarts.dispose(document.getElementById('myhistogram2'))
    const myChart = echarts.init(document.getElementById('myhistogram2'))
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross', // 将type设置为'cross'
          label: {
            backgroundColor: '#6e7079',
          },
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 45,
          textStyle: { fontStyle: 'italic' },
        },
        data: shengfendate,
      },
      yAxis: {
        type: 'value',
        name: '个',
        boundaryGap: [0, 0.01],
      },
      series: [
        {
          name: '矿工IP数',
          type: 'bar',
          data: kgipsdate2,
        },
        {
          name: '矿机数',
          type: 'bar',
          data: kjsdate2,
        },
      ],
    }
    option && myChart.setOption(option)
  }

  const activeName = ref('first')

  const handleClick = (tab, event) => {
    if (tab.props.name === 'first') {
      document.getElementById('showfbqktj1').style.display = 'block' // 显示元素
      document.getElementById('showfbqktj2').style.display = 'none' // 隐藏元素
    } else {
      document.getElementById('showfbqktj2').style.display = 'block' // 显示元素
      document.getElementById('showfbqktj1').style.display = 'none' // 隐藏元素
    }
  }

  //获取数据
  const loadAPI = async () => {
    const { data: res } = await service.get('/api/v1/get_mining_header', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (res.code == 200) {
      kgiprhs.value = res.data.mining_ip_num
      kjsl.value = res.data.machine_num
      kciprhs.value = res.data.pool_ip_num
      zhdzsl.value = res.data.account_num
    }
    const { data: resBar } = await service.get('/api/v1/get_mining_coins', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (resBar.code == 200) {
      const currencies = Object.keys(resBar.data.miner)
      const minerValues = Object.values(resBar.data.miner).map((value) => value || 0)
      const machineValues = Object.values(resBar.data.machine).map((value) => value || 0)
      drawHistogram1(currencies, minerValues, machineValues)
    }
    const { data: tableData } = await service.get('/api/v1/get_mining_top', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (tableData.code == 200) {
      selltableData.value = tableData.data
    }
    const { data: resArea } = await service.get('/api/v1/get_mining_area', {
      params: {
        s_date: dayjs(datetime.value[0].toLocaleString()).format('YYYY-MM-DD'),
        e_date: dayjs(datetime.value[1].toLocaleString()).format('YYYY-MM-DD'),
      },
    })
    if (resArea.code == 200) {
      const cities = Object.keys(resArea.data.miner)
      const minerValues2 = Object.values(resArea.data.miner).map((value) => value || 0)
      const machineValues2 = Object.values(resArea.data.machine).map((value) => value || 0)
      drawHistogram2(cities, minerValues2, machineValues2)
    }
  }
  onMounted(() => {
    loadAPI()
    searchForm()
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
    vertical-align: top;
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

  .product .el-tabs__header {
    margin: 0;
  }

  .product .el-button--info {
    --el-button-text-color: rgba(0, 0, 0, 0.647058823529412);
    --el-button-bg-color: #ffffff;
  }
</style>
<style lang="scss" scoped>
  :deep(#tab-first) {
    margin-left: 20px !important;
  }
  :deep(.el-tabs__active-bar is-top) {
    margin-left: 20px !important;
  }
  :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
    height: 50px !important;
  }
</style>
