import request from "@/utils/request"; //在同一src路径下

export default {
  //page当前页码 size每页条数 searchMap条件查询条件值
  searchList(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  //add goods
  addGoods(goods) {
    return request({
      url: `/goods`,
      method: "post",
      data: goods
    });
  },
  //add goods
  getById(id) {
    return request({
      url: `/goods/${id}`,
      method: "get"
    });
  },
  //add goods
  updateGoods(goodsobj) {
    return request({
      url: `/goods/${goodsobj.id}`,
      method: "put",
      data: goodsobj
    });
  },
  deleteGoods(id) {
    return request({
      url: `/goods/${id}`,
      method: "delete"
    });
  }
};
