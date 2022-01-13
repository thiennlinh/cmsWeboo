import store from "@/store";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const super_admin = "admin";
    const roles = store.getters && store.getters.roles;

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value;

      const hasRole = roles.some(role => {
        return super_admin === role || roleFlag.includes(role);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`Vui lòng đặt giá trị thẻ quyền vai trò"`);
    }
  }
};
