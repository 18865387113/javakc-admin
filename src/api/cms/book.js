import request from '@/utils/request'

const api_name = '/cms/book'

export default {
  // ## 动态条件查询带分页
  findPageBook(pageNo, pageSize, bookQuery) {
    return request({
      url: `${api_name}/${pageNo}/${pageSize}`,
      method: 'post',
      data: bookQuery
    })
  },
  // ## 添加书籍
  saveBook(book) {
    return request({
      url: `${api_name}/saveBook`,
      method: 'post',
      data: book
    })
  }
}
