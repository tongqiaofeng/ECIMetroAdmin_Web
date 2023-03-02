import { get, post } from '../http';

/**
 * 用户列表
 * @returns 
 */
export const accountList = () => {
  return get('/account/accountListGet');
}

/**
 * 新增修改用户(id表示修改)
 * @param data 
 * @returns 
 */
export const accountSave = (data: object) => {
  return post('/account/accountSave', data);
}

/**
 * 删除用户
 * @param id 
 * @returns 
 */
export const accountDel = (id: number) => {
  return get('/account/accountDel', {
    id: id
  });
}