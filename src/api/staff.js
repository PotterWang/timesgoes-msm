import request from "@/utils/request"; //在同一src路径下

export default {
  getList() {
    return request({
      url: `/staff/list`,
      method: "get"
    });
  },
  //page当前页码 size每页条数 searchMap条件查询条件值
  searchList(page, size, searchMap) {
    return request({
      url: `/staff/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  //add staff
  addStaff(staff) {
    return request({
      url: `/staff`,
      method: "post",
      data: staff
    });
  },
  //add staff
  getById(id) {
    return request({
      url: `/staff/${id}`,
      method: "get"
    });
  },
  //add staff
  updateStaff(staffobj) {
    return request({
      url: `/staff/${staffobj.id}`,
      method: "put",
      data: staffobj
    });
  },
  deleteStaff(id) {
    return request({
      url: `/staff/${id}`,
      method: "delete"
    });
  }
};
