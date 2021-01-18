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
  upOrDownBook(bookId, status) {
    return request({
      url: `${api_name}/${bookId}/${status}`,
      method: 'put'
    })
  },
  // ## 添加书籍
  saveBook(book) {
    return request({
      url: `${api_name}/saveBook`,
      method: 'post',
      data: book
    })
  },
  getBookById(id){
    return request({
      url: `${api_name}/getBookById/${id}`,
      method: 'get'
    })
  },
  updateBook(book) {
    return request({
      url: `${api_name}/updateBook`,
      method: 'put',
      data: book
    })
  },
  deleteById(bookId) {
    return request({
      url: `${api_name}/deleteById/${bookId}`,
      method: 'delete'
    })
  }
}
