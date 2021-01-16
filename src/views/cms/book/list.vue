<template>
  <div id="app-container">
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
          {{ scope.row.isSerialize === 1 ? '是' : '否'}}
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
        currentTime: '' // ## 当前时间
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
      }
    }
  }
</script>
