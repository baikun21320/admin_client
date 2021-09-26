import ajax from "./ajax";
import axios from "axios";
import {message} from "antd";
//登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
//获取一级、二级分类的列表
export const reqCategorys = (parentId)=> ajax('/manage/category/list',{parentId})
//添加分类
export const reqAddCategory = (categoryName, parentId)=> ajax('/manage/category/add',{categoryName, parentId}, 'POST')
//更新分类
export const reqUpdateCategory = (categoryId, categoryName)=> ajax('/manage/category/update',{categoryId, categoryName}, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list',{pageNum,pageSize})
//搜索商品分页列表
//searchType: 搜索类型， productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType})=> ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]: searchName
})
//获取分类名称
export const reqCategory = categoryId => ajax('/manage/category/info', {categoryId})
//更新商品状态 -- 上架、下架
export const updateStatus = (productId, status) => ajax('/manage/product/updateStatus',{productId, status},'POST')
//删除图片操作
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name},'POST')
//添加商品
export const reqaddOrUpdateProduct = (product)=> ajax('/manage/product/'+(product._id? 'update': 'add'),product, 'POST')
//修改商品
// export const reqUpdateProduct = (product)=> ajax('/manage/product/update',product, 'POST')
//获取所有角色的列表
export const reqRoles =()=> ajax('/manage/role/list')
//添加角色
export const reqAddRole = (roleName)=> ajax('/manage/role/add',{roleName},'POST')
//更新角色权限
export const reqUpdateRole = (role)=> ajax('/manage/role/update',role,'POST')
//获取所以用户列表
export const reqUsers = ()=> ajax('/manage/user/list')

//删除指定用户
export const reqDeleteUser = (userId)=> ajax('/manage/user/delete',{userId},'POST')

//添加或修改用户
export const reqAddOrUpdateUser = (user)=> ajax('/manage/user/'+(user._id? 'update':'add'),user,'POST')




//高德地图天气请求
export const reqWeather = (city)=>{
    const url = 'https://restapi.amap.com/v3/weather/weatherInfo?city='+city+'&output=json&key=6f1c399acae9dac74814f305790fb4ed'
    return new Promise((resolve, reject)=>{
        const promise = axios.get(url)
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=> {
            message.error(error.message)
        })
    })
}
