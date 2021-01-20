<template>
  <div id="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="bookQuery.bookName" placeholder="书名" />
      </el-form-item>

      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="bookQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="bookQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" @click="getPageBookList()">查询</el-button>
      <el-button type="primary" @click="resetData()">清空</el-button>
      <router-link :to="'/cms/book/create'">
        <el-button type="primary">添加书籍</el-button>
      </router-link>
      <el-button type="primary" @click="exportExcel">导出<i class="el-icon-download el-icon--right"></i></el-button>
      <el-button type="primary" @click="excelDialogVisible=true">导入<i class="el-icon-upload el-icon--right"></i></el-button>
    </el-form>
    <el-table :data="bookList" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="书籍ID" width="80" />
      <el-table-column prop="bookName" label="书名"/>
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="level1Id" label="一级分类" />
      <el-table-column prop="level2Id" label="二级分类" />
      <el-table-column label="连载">
        <template slot-scope="scope">
          {{ scope.row.isSerialize === 1 ? '连载中' : '完结'}}
        </template>
      </el-table-column>
      <el-table-column prop="wordNumber" label="字数" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.isOnline === 1 ? '上线' : '未上线'}}
        </template>
      </el-table-column>
      <el-table-column label="全本收费">
        <template slot-scope="scope">
          {{ scope.row.isCharge === 1 ? '收费' : '免费' }}
        </template>
      </el-table-column>
      <el-table-column prop="grantStartTime" label="授权开始时间" />
      <el-table-column prop="grantEndTime" label="授权结束时间" />
      <el-table-column label="原创">
        <template slot-scope="scope">
          {{ scope.row.isOriginal === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          {{ currentTime > scope.row.grantEndTime ? '过期' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteBook(scope.row.id, scope.row.isOnline)">删除</el-button>
          <router-link :to="'/cms/book/update/'+scope.row.id">
            <el-button type="primary" size="mini" >修改</el-button>
          </router-link>
          <el-button v-if="scope.row.isOnline === 0" type="danger" size="mini" icon="el-icon-delete" @click="upOrDownBook(scope.row.id, 1)">上架书籍</el-button>
          <el-button v-else type="danger" size="mini" @click="upOrDownBook(scope.row.id, 0)">下架书籍</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getPageBookList">
    </el-pagination>
    <!-- Excel导入 -->
    <el-dialog
      title="导入Excel"
      :visible.sync="excelDialogVisible"
      width="30%">
      <el-upload
        ref="upload"
        name="file"
        accept="application/vnd.ms-excel"
        :action="BASE_API + '/cms/book/importExcel'"
        :on-success="fileUploadSuccess"
        :on-error="fileUploadError"
        :disabled="importBtnDisabled"
        :limit="1"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="importExcel">上传到服务器</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  import book from '@/api/cms/book'
  export default {
    data() { // ## 定义变量和初始值
      return {
        bookList: null, // ## 数据列表
        bookQuery: {}, // ##查询条件封装对象
        total: 0, // ## 总记录数
        pageNo: 1, // ## 页码
        pageSize: 10, // ## 每页显示记录数
        currentTime: '', // ## 当前时间
        BASE_API: process.env.VUE_APP_BASE_API, // ## 接口API地址
        excelDialogVisible: false, // ## 导入Excel窗口, false为关闭
        importBtnDisabled: false // ## 按钮是否禁用,false为不禁用
      }
    },
    created() { // ## 在页面渲染之前,一般先调用methods定义的方法
      this.getPageBookList()
    },
    methods: { // ## 创建具体的方法,调用 book.js 定义的方法
      getPageBookList(pageNo = 1) { // ## 调用 api 获取数据
        this.pageNo = pageNo
        book.findPageBook(this.pageNo, this.pageSize, this.bookQuery)
          .then(response => {
            this.bookList = response.data.items
            this.total = response.data.total
            this.currentTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          })
      },
      format(date, fmt) { // ## 格式化日期
        let o = {
          'M+': date.getMonth() + 1, // ## 月份
          'd+': date.getDate(), // ## 日
          'H+': date.getHours(), // ## 小时
          'm+': date.getMinutes(), // ## 分
          's+': date.getSeconds(), // ## 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // ## 季度
          'S': date.getMilliseconds() // ## 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o)
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        return fmt
      },
      resetData() { // ## 清空方法
                    // ##清空所有值
        this.bookQuery = {}
        // ##查询所有数据
        this.getPageBookList()
      },
      deleteBook(id, status) { // ## 删除书籍
        if (status === 1) {
          this.$message({
            type: 'error',
            message: '上线书籍不允许删除!'
          })
          return
        }
        this.$confirm('此操作将永久删除该书籍记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          book.deleteById(id)
            .then(response => {
              this.getPageBookList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
        })
      },
      upOrDownBook(bookId, status) { // ## 设置书籍上下架
        this.$confirm('此操作将改变书籍上下线记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          book.upOrDownBook(bookId, status)
            .then(response => {
              this.getPageBookList()
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            })
        })
      },
      exportExcel() { // ## 导出Excel
        document.location.href = this.BASE_API + '/cms/book/exportExcel'
      },
      importExcel() { // ## 导入Excel
                      // ## 禁用按钮
        this.importBtnDisabled = true
        this.$refs.upload.submit()
      },
      fileUploadSuccess(response) { // ## 导入成功后执行方法
                                    // ## 导入成功后关闭窗口
        this.excelDialogVisible = false
        // ## 重新查询获取新数据
        this.getPageBookList()
        // ## 提示信息
        this.$message({
          type: 'success',
          message: '导入成功'
        })
      },
      fileUploadError() { // ## 导入失败后执行方法
                          // ## 提示信息
        this.$message({
          type: 'error',
          message: '导入失败'
        })
      }
    }
  }
</script>
