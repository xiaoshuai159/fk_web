<template>
  <div style="margin-top: 60px">
    <div style="background-color: #ffffff; height: 40px; line-height: 54px; position: absolute; width: 100%">
      <el-row>
        <el-col :span="3"></el-col>
        <el-col :span="21">
          <el-icon :size="14">
            <Location />
          </el-icon>
          当前位置：首页 > <span style="color: #5d9fff">问题处理结果展示</span>
        </el-col>
      </el-row>
    </div>
    <el-row style="background-color: #ffffff; padding: 10px 0; margin-top: 40px">
      <el-col :span="3"></el-col>
      <el-col :span="18">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="问题处理结果展示" name="first">
            <div>
              <p v-for="(d, index) in problemList" :key="index" class="problem-item" @click="showDetail(d)"
                ><span style="font: 16px"> · {{ d.p_content }}</span
                ><span style="float: right; color: #b0b1b1; font-size: 12px">{{ d.p_time }}</span>
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" :title="'标题：' + selectedDetail.p_line" width="40%">
      <p style="color: #606166; font-size: 12px; margin: 0"
        ><span>时间：{{ selectedDetail.p_time }}</span> <span style="margin-left: 6px">来源：{{ selectedDetail.p_url }}</span>
      </p>
      <p style="color: #333333; font-size: 16px; text-indent: 2em; line-height: 2em">{{ selectedDetail.p_content }}</p>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import service from '@/api/request'
  import type { TabsPaneContext } from 'element-plus'

  const activeName = ref('first')
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  let problemList = ref([
    // {p_line:'title1',p_time:'2024-04-24',p_content:'公告内容1',p_url:"涉及url1",p_status:'问题状态1'},
    // {p_line:'title2',p_time:'2024-04-25',p_content:'公告内容2',p_url:"涉及url2",p_status:'问题状态2'}
  ])
  let dialogVisible = ref(false)
  const selectedDetail = ref({ p_line: '', p_time: '', p_content: '', p_url: '', p_status: '' })

  const showDetail = (detail) => {
    selectedDetail.value = detail
    dialogVisible.value = true
  }
  onMounted(async () => {
    const { data: res } = await service.get('/api/v1/get_public_notes')
    problemList.value = res.data
    // problemList.value = [
    //   { p_line: '关于调整网络安全专用产品安全管理公告', p_time: '2024-04-24', p_content: '为加强网络安全专用产品暗族青年管理，推动安全认证和安全监测结果互认，避免重复认证、检测。', p_url: "中国网信网", p_status: '问题状态1' },
    //   { p_line: 'title2', p_time: '2024-04-25', p_content: '公告内容2', p_url: "涉及url2", p_status: '问题状态2' }
    // ]
  })
</script>
<style lang="scss" scoped>
  :deep(.el-dialog__body) {
    padding-top: 14px;
  }
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  :deep(.el-tabs__item.is-active) {
    color: #333333;
  }

  :deep(.el-tabs__item) {
    font-weight: 600;
    font-size: 20px;
    height: 46px;
  }

  .problem-item:hover {
    color: #024bb7;
    /* 鼠标悬停时字体颜色变为 #024bb7 */
    text-decoration: underline;
    /* 添加下划线效果 */
    cursor: pointer;
  }
</style>
