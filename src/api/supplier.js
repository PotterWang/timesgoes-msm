import request from "@/utils/request"; //在同一src路径下

export default {
  getList() {
    return request({
      url: `/supplier/list`,
      method: "get"
    });
  },
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  addSupplier(supplier) {
    return request({
      url: `/supplier`,
      method: "post",
      data: supplier
    });
  },
  //edit member
  getById(id) {
    return request({
      url: `/supplier/${id}`,
      method: "get"
    });
  },
  //edit & promise
  updateSupplier(supplier) {
    return request({
      url: `/supplier/${supplier.id}`,
      method: "put",
      data: supplier
    });
  },
  //删除
  deleteSupplier(id) {
    return request({
      url: `/supplier/${id}`,
      method: "delete"
    });
  }
};
