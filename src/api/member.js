import request from "@/utils/request"; //在同一src路径下

export default {
  getList() {
    return request({
      url: `/member/list`,
      method: "get"
    });
  },
  //page当前页码 size每页条数 searchMap条件查询条件值
  searchList(page, size, searchMap) {
    return request({
      url: `/member/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  //add member
  addMember(member) {
    return request({
      url: `/member`,
      method: "post",
      data: member
    });
  },
  //add member
  getById(id) {
    return request({
      url: `/member/${id}`,
      method: "get"
    });
  },
  //add member
  updateMember(memberobj) {
    return request({
      url: `/member/${memberobj.id}`,
      method: "put",
      data: memberobj
    });
  },
  deleteMember(id) {
    return request({
      url: `/member/${id}`,
      method: "delete"
    });
  }
};
