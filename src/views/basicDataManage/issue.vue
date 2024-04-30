<template>
  <div class="app-container demo-tabs">
    <!-- <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="16">
          <div>
            <span>主题：</span>
            <el-input v-model="ztInput" style="width: 240px" placeholder="请输入" />
            <span style="margin-left: 10px">处理状态：</span>

            <el-select v-model="clztValue" placeholder="请选择" clearable>
              <el-option v-for="item in clztOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin-right: 20px">
            <el-button type="primary" @click="searchClick">查 询</el-button>
            <el-button @click="resetClick">重 置</el-button>
            <a style="margin-left: 14px; cursor: pointer; color: #1675d5" @click="toggleAdvanced">
              {{ isCollapse ? '收起' : '展开' }}
            </a>
          </div>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <div v-show="isCollapse">
          <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="20">
              <div style="display: inline-block; margin-top: 10px">
                <span>用户：</span>
                <el-input v-model="dzValue" style="width: 240px" placeholder="请输入" />
                <span style="margin-left: 10px">提交时间：</span>
                <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始时间"
                  end-placeholder="结束时间" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div> -->
    <el-row style="margin-top: 32px">
      <el-col :span="1"></el-col>
      <el-col :span="22">
        <div class="tableClass">
          <el-table
            :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" width="30" align="center" />
            <el-table-column prop="q_line" label="标题" show-overflow-tooltip min-width="100" align="center" />
            <el-table-column prop="q_content" label="问题描述" show-overflow-tooltip min-width="150" align="center" />
            <el-table-column prop="q_url" label="问题链接" show-overflow-tooltip min-width="200" align="center" />
            <el-table-column prop="status" label="问题状态" show-overflow-tooltip min-width="100" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status == '已解决' ? 'success' : 'danger'" disable-transitions>{{ scope.row.status }}</el-tag>
              </template></el-table-column
            >
            <el-table-column prop="system_type" label="操作系统" show-overflow-tooltip min-width="100" align="center" />
            <el-table-column prop="browser" label="浏览器类型" show-overflow-tooltip min-width="100" align="center" />
            <el-table-column prop="q_type" label="问题类型" show-overflow-tooltip min-width="100" align="center" />
            <el-table-column prop="name" label="姓名" show-overflow-tooltip min-width="100" align="center" />
            <el-table-column prop="contact_info" label="联系方式" show-overflow-tooltip min-width="140" align="center" />
            <el-table-column prop="create_time" label="提交时间" show-overflow-tooltip min-width="180" align="center" />
            <el-table-column prop="pic" label="图片" show-overflow-tooltip min-width="70" align="center">
              <template #default="scope">
                <el-button type="primary" link size="small" @click="showImg(scope.row)"> 查看 </el-button>
              </template>
            </el-table-column>

            <el-table-column prop="operator" label="操作" width="120" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                <!-- <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="pagination.currentPage"
            background
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" top="80px">
      <div v-for="(url, index) in imgSrcArr" :key="index">
        <img :src="url" :alt="'图片' + (index + 1)" style="width: 100%; height: auto; margin-bottom: 10px" />
      </div>
    </el-dialog>
    <el-dialog v-model="ztDialogVisible" width="30%" top="80px" title="修改状态">
      <div>
        状态：
        <el-select v-model="clztValue" style="width: 60%">
          <el-option v-for="item in clztOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ztDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, Ref, onMounted } from 'vue'
  import service from '@/api/request'
  import { ElMessage } from 'element-plus'
  let dialogVisible = ref(false)
  let ztDialogVisible = ref(false)
  const ztInput = ref('')
  const ncInput = ref('')
  const clztValue = ref('')
  let clztOptions = ref([
    { value: '已解决', label: '已解决' },
    { value: '未解决', label: '未解决' },
  ])
  const dzValue = ref('')
  let dzOptions = ref([])
  const curPhone = ref('')
  let date = ref('')
  let imgSrcArr = ref([])
  // onBeforeMount(() => {
  //   curPhone.value = JSON.parse(window.sessionStorage.getItem('curPhone'))
  //   searchClick()
  // })
  onMounted(async () => {
    // console.log(res.data[0].img_1);
    // const img = new Image();
    // img.src = res.data[0].img_1;
    searchClick2()
  })
  const searchClick2 = async () => {
    const { data: res } = await service.get('/ManageApi/v1/search')
    tableData.value = res.data
  }
  let tableData = ref([])
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  const showImg = (row) => {
    let imgArr = []
    if (row.img_5.length != 0) {
      imgArr.push(row.img_5)
    }
    if (row.img_4.length != 0) {
      imgArr.push(row.img_4)
    }
    if (row.img_3.length != 0) {
      imgArr.push(row.img_3)
    }
    if (row.img_2.length != 0) {
      imgArr.push(row.img_2)
    }
    if (row.img_1.length != 0) {
      imgArr.push(row.img_1)
    }
    imgSrcArr.value = []
    for (let img of imgArr) {
      // 首先，对字符串进行URL解码
      // let decodedURIComponent = decodeURIComponent(img);
      // console.log(decodedURIComponent);

      // // 然后，对解码后的字符串进行Base64解码
      // let base64Data = atob(decodedURIComponent);
      // console.log( base64Data);
      // 构造data URL
      let dataUrl = 'data:image/jpeg;base64,' + img
      // let dataUrl =new Blob([img], { type: 'image/jpeg' })
      // const i = new Image();
      // i.src = dataUrl;
      imgSrcArr.value.push(dataUrl)
    }
    dialogVisible.value = true
  }
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
  }
  const multipleSelection = ref([])
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
  }
  let isCollapse: Ref<boolean> = ref(false)
  const toggleAdvanced = () => {
    isCollapse.value = !isCollapse.value
  }

  const searchClick = async () => {
    const queryData = {
      value: curPhone.value,
      exchange: ztInput.value,
      address: dzValue.value,
      chain: clztValue.value,
      nickname: ncInput.value,
    }
    const { data: res } = await service.get('/api/v1/query_name', { params: queryData })
    if (res.code == 200) {
      tableData.value = res.data
      console.log(res.data[0].img_1)

      // clztOptions.value = Array.from(new Set(res.data.map((item) => item.chain))).map((chain) => ({ label: chain, value: chain }))
      // dzOptions.value = Array.from(new Set(res.data.map(item=>item.address))).map(address=>({label:address,value:address}))
    }
  }
  const resetClick = () => {
    console.log('点击了重置按钮')
    ztInput.value = ''
    clztValue.value = ''
    dzValue.value = ''
    ncInput.value = ''
    searchClick()
  }
  let curId = ''
  let curStatus = ''
  const editHandler = (row) => {
    curId = row.q_id
    curStatus = row.status
    clztValue.value = row.status
    ztDialogVisible.value = true
  }
  const submitForm = async () => {
    // let reqData = {
    //   q_id:curId,
    //   status:curStatus
    // }
    curStatus = clztValue.value
    const formData = new FormData()
    formData.append('q_id', curId)
    formData.append('status', curStatus)
    const { data: res } = await service.post('/ManageApi/v1/update_status', formData)
    console.log(res)

    if (res.code == 200) {
      ElMessage.success('修改成功')
      ztDialogVisible.value = false
      searchClick2()
    }
  }
  const del = (row) => {
    console.log(row)
  }
</script>
<style lang="scss" scoped>
  .el-pagination {
    margin: 15px 0;
    justify-content: center !important;
  }

  .demo-tabs {
    background-color: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin: 10px 12px !important;
    height: auto;
  }

  // .first-tab{
  //     margin-left: 20px;
  // }
  :deep(#tab-first) {
    margin-left: 20px !important;
  }

  :deep(.el-tabs__active-bar is-top) {
    margin-left: 20px !important;
  }
</style>
