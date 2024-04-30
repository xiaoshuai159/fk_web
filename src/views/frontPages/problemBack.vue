<template>
  <div>
    <!-- <div style="background-color: #ffffff; height: 40px; line-height: 54px; position: absolute; width: 100%">
      <el-row>
        <el-col :span="3"></el-col>
        <el-col :span="21">
          <el-icon :size="14">
            <Location />
          </el-icon>
          当前位置：首页 > <span style="color: #5d9fff">问题或意见反馈</span>
        </el-col>
      </el-row>
    </div> -->
    <el-row style="background-color: #ffffff; padding: 10px 0">
      <el-col :span="3"></el-col>
      <el-col :span="18">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="问题或意见反馈" name="first">
            <div>
              <div style="font-size: 24px; font-weight: 600; margin: 10px 0px"
                ><span style="border-bottom: 5px solid #00b9ef">我要</span><span style="color: #4fbaf0">反馈</span>
              </div>
              <img src="src/assets/image/f2.png" alt="Description of the image" width="10%" style="display: block; margin: 0 auto" />
              <div style="height: 60px; margin-bottom: 20px; line-height: 36px; margin: 20px 0px; text-indent: 2em; font-size: 18px">
                为了及时发现和优化转换系统存在的协议转换异常，访问延迟、网络丢包、网站无法打开等问题，特开设留言反馈系统，
                记录您在访问过程中遇到的问题，期待各位用户能够积极参与，详细填写，留下您的宝贵意见，以便促进本系统的建设优化，
                提升网站服务质量。
              </div>
            </div>

            <div>
              <div style="font-size: 24px; font-weight: 600; margin: 10px 0px"
                ><span style="border-bottom: 5px solid #00b9ef">基本信息</span><span style="color: #4fbaf0">填写</span>
              </div>
              <el-row>
                <el-col :span="24" style="display: flex; justify-content: center">
                  <el-form
                    ref="ruleFormRef"
                    style="min-width: 400px"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="auto"
                    class="demo-ruleForm"
                    :size="formSize"
                    status-icon
                  >
                    <el-form-item label="标题" prop="bt">
                      <el-input v-model="ruleForm.bt" />
                    </el-form-item>
                    <el-form-item label="问题描述" prop="wtms">
                      <el-input v-model="ruleForm.wtms" type="textarea" />
                    </el-form-item>
                    <el-form-item label="问题链接" prop="wtlj">
                      <el-input v-model="ruleForm.wtlj" />
                    </el-form-item>
                    <el-form-item label="平台" prop="pt">
                      <el-select-v2 v-model="ruleForm.pt" :options="ptOptions" />
                    </el-form-item>
                    <el-form-item label="操作系统" prop="czxt">
                      <el-select-v2 v-model="ruleForm.czxt" :options="czxtOptions" />
                    </el-form-item>
                    <el-form-item label="浏览器类型" prop="llqlx">
                      <el-select-v2 v-model="ruleForm.llqlx" :options="llqlxOptions" />
                    </el-form-item>
                    <el-form-item label="上传附件：仅限图片">
                      <el-upload
                        v-model:file-list="fileList"
                        class="upload-demo"
                        action="#"
                        :limit="5"
                        :on-exceed="handleExceed"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :auto-upload="false"
                        list-type="picture"
                        :before-upload="beforeUpload"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <template #tip>
                          <div class="el-upload__tip" style="color: #b0b1b1; font-size: 12px"> 至少上传一张jpg文件，但不能超过5张 </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="问题分类" prop="wtfl">
                      <el-select-v2 v-model="ruleForm.wtfl" :options="wtflOptions" />
                    </el-form-item>
                    <el-form-item label="姓名" prop="xm">
                      <el-input v-model="ruleForm.xm" />
                    </el-form-item>
                    <el-form-item label="联系方式" prop="lxfs">
                      <el-input v-model="ruleForm.lxfs" />
                    </el-form-item>
                    <!-- 添加验证码输入框 -->
                    <!-- <el-form-item label="" prop="captcha">
                      <el-input v-model="ruleForm.captcha" placeholder="请输入验证码" auto-complete="off"
                        style="position: relative" @keyup.enter="submitForm(ruleFormRef)">
                        <template #prefix>
                          <el-icon class="el-input__icon">
                            <PictureFilled />
                          </el-icon>
                        </template>
                        <template #suffix>
                          <img :src="getCaptchaImgUrl()" alt="验证码" class="captcha-input__img" @click="refreshCaptcha" />
                        </template>
                      </el-input>
                    </el-form-item> -->
                    <el-form-item>
                      <div style="transform: translateX(140%)">
                        <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
                        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onBeforeMount, nextTick } from 'vue'
  import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
  import service from '@/api/request'
  import router from '@/routers'
  import type { TabsPaneContext } from 'element-plus'
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

  const activeName = ref('first')
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  const fileList = ref<UploadUserFile[]>([])
  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
  }

  const handleChange: UploadProps['onChange'] = (file) => {
    // console.log("change")
  }
  // 处理图片上传前的验证
  const beforeUpload = (file: File) => {
    // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    // const isLt2M = file.size / 1024 / 1024 < 2

    // if (!isJPG) {
    //   window.alert('上传图片只能是 JPG/PNG 格式!');
    // }
    // if (!isLt2M) {
    //   window.alert('上传图片大小不能超过 2MB!');
    // }

    if (fileList.value.length >= 5) {
      window.alert('上传图片不能超过5张!')
      return false // 返回 false 取消上传
    }
    return true
    // return  new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file.raw);
    //         reader.onload = () => {
    //           file.base64Url = reader.result;
    //           resolve();
    //         };
    //       });;
  }

  // 处理图片上传超过限制时的操作
  const handleExceed = () => {
    window.alert('只能上传 5 张图片!')
  }
  // form相关 start ------------------
  interface RuleForm {
    bt: string
    wtms: string
    wtlj: string
    pt: string
    czxt: string
    llqlx: string
    wtfl: string
    xm: string
    lxfs: string
    images: any
    captcha: string
  }

  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    bt: '',
    wtms: '',
    wtlj: '',
    pt: '',
    czxt: '',
    llqlx: '',
    wtfl: '',
    xm: '',
    lxfs: '',
    images: [],
    captcha: '',
  })

  const locationOptions = ['Home', 'Company', 'School']

  const rules = reactive<FormRules<RuleForm>>({
    wtms: [
      {
        required: true,
        message: 'Please select Activity zone',
        trigger: 'change',
      },
    ],
    pt: [{ required: true, message: '请选择', trigger: 'change' }],
    czxt: [{ required: true, message: '请选择', trigger: 'change' }],
    llqlx: [{ required: true, message: '请选择', trigger: 'change' }],
    wtfl: [{ required: true, message: '请选择', trigger: 'change' }],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!fileList.value.length) {
      ElMessage.error('至少上传一张图片！')
      return false
    }
    ruleForm.images = fileList.value
    console.log(ruleForm.images[0].raw)

    // const getData = {
    //   q_line:ruleForm.bt,
    //   q_content:ruleForm.wtms,
    //   q_url:ruleForm.wtlj,
    //   platform:ruleForm.pt,
    //   system_type:ruleForm.czxt,
    //   browser:ruleForm.llqlx,
    //   q_type:ruleForm.wtfl,
    //   name:ruleForm.xm,
    //   contact_info:ruleForm.lxfs,
    //   img_1:ruleForm.images[0]?ruleForm.images[0].raw:'',
    //   img_2:ruleForm.images[1]?ruleForm.images[1].raw:'',
    //   img_3:ruleForm.images[2]?ruleForm.images[2].raw:'',
    //   img_4:ruleForm.images[3]?ruleForm.images[3].raw:'',
    //   img_5:ruleForm.images[4]?ruleForm.images[4].raw:'',

    // }
    const formData = new FormData()

    // 将规则表单中的数据装入 FormData 对象
    formData.append('q_line', ruleForm.bt)
    formData.append('q_content', ruleForm.wtms)
    formData.append('q_url', ruleForm.wtlj)
    formData.append('platform', ruleForm.pt)
    formData.append('system_type', ruleForm.czxt)
    formData.append('browser', ruleForm.llqlx)
    formData.append('q_type', ruleForm.wtfl)
    formData.append('name', ruleForm.xm)
    formData.append('contact_info', ruleForm.lxfs)

    // 将图片文件数据装入 FormData 对象
    if (ruleForm.images[0]) {
      formData.append('img_1', ruleForm.images[0].raw)
    }
    if (ruleForm.images[1]) {
      formData.append('img_2', ruleForm.images[1].raw)
    }
    if (ruleForm.images[2]) {
      formData.append('img_3', ruleForm.images[2].raw)
    }
    if (ruleForm.images[3]) {
      formData.append('img_4', ruleForm.images[3].raw)
    }
    if (ruleForm.images[4]) {
      formData.append('img_5', ruleForm.images[4].raw)
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        console.log('submit!')
        const { data: res } = await service.post('/api/v1/submit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 指定请求头
          },
        })
        if (res.code == 200) {
          ElMessage.success('上传成功！')
          formEl.resetFields()
          ruleForm.images = []
          fileList.value = []
        } else {
          ElMessage.error(res.data.msg)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    ruleForm.images = []
    fileList.value = []
  }

  let ptOptions = reactive([
    { value: 'web端', label: 'web端' },
    { value: '手机端', label: '手机端' },
    { value: '平板', label: '平板' },
  ])
  let czxtOptions = reactive([
    { value: 'linux', label: 'linux' },
    { value: 'windows', label: 'windows' },
  ])
  let llqlxOptions = reactive([
    { value: 'Firefox', label: 'Firefox' },
    { value: 'Chrome', label: 'Chrome' },
    { value: 'HUAWEI', label: 'HUAWEI' },
    { value: 'Microsoft Edge', label: 'Microsoft Edge' },
    { value: '360', label: '360' },
    { value: 'UC', label: 'UC' },
  ])
  let wtflOptions = reactive([
    { value: '网页记载不全', label: '网页加载不全' },
    { value: '加密访问', label: '加密访问' },
    { value: '加载超时', label: '加载超时' },
    { value: '加载缓慢', label: '加载缓慢' },
    { value: '页面元素加载失败', label: '页面元素加载失败' },
    { value: '视频无法播放', label: '视频无法播放' },
    { value: '上传过慢', label: '上传过慢' },
    { value: '下载过慢', label: '下载过慢' },
    { value: '视频播放卡顿', label: '视频播放卡顿' },
    { value: '无法登陆', label: '无法登陆' },
    { value: '点击无响应', label: '点击无响应' },
    { value: '关键词过滤异常', label: '关键词过滤异常' },
    { value: '首页无法打开', label: '首页无法打开' },
    { value: '相应状态码错误', label: '相应状态码错误' },
    { value: '搜索查询异常', label: '搜索查询异常' },
    { value: '页面布局错乱', label: '页面布局错乱' },
    { value: '其他', label: '其他' },
  ])

  // end -----------------------------
</script>
<style lang="scss" scoped>
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
    font-size: 28px;
    height: 46px;
  }
</style>
