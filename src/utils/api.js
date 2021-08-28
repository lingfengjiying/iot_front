/**此文档用于系统API访问的设置 */

const baseURL = "http://127.0.0.1:8080";

const APILIST={
    getUserList:'/userManage/getUserList',//获取用户列表
    getOrganizationList:'/organizationManage/getOrganizationList',//获取组织机构列表
    getUserSelectList: '/userManage/getUserSelectList',//获取用户选择框
    login:'/login',//登陆
    updateOrganizationInfo:'/organizationManage/updateOrganizationInfo',//更新组织机构信息
    delOrganization: '/organizationManage/delOrganization',//删除(伪删除组织机构信息)
    addOrganizationInfo:'/organizationManage/addOrganizationInfo',//添加新的组织机构信息
    getOrganizationSelectList:'/organizationManage/getOrganizationSelectList',//获取组织结构列表
    updateUserInfo:'/userManage/updateUserInfo',//更新用户信息
    delUserInfo:'/userManage/delUserInfo',//删除用户信息
    addUserInfo:'/userManage/addUserInfo',//添加用户信息
    getDeviceDataList:'/deviceDataManage/getDeviceDataList',//获取设备当前温度和湿度数据
    getDeviceInfoList:'/deviceInfoManage/getDeviceInfoList',//获取设备基本信息列表
    updateDeviceInfo:'/deviceInfoManage/updateDeviceInfo',//更新设备基本信息
    addDeviceInfo: '/deviceInfoManage/addDeviceInfo',//添加设备基本信息
    delDeviceInfo:'/deviceInfoManage/delDeviceInfo',//删除（逻辑删除，伪删除）设备信息
    getDeviceAccessList:'/deviceAccessManage/getDeviceAccessList',//设备权限列表
    setDeviceAccess:'/deviceAccessManage/setDeviceAccess',//添加或者设置用户权限
    removeAccess:'/deviceAccessManage/removeAccess',//移除用户权限
    getPolicyList:'/policyManage/getPolicyList',//获取策略列表
    addPolicy:'/policyManage/addPolicy',//添加策略信息
    updatePolicy: '/policyManage/updatePolicy',//修改策略信息
    removePolicy:'/policyManage/removePolicy',//移除策略信息
    getDevicePolicyList:'/DevicePolicyManage/getDevicePolicyList',//获取设备策略列表页
    getPolicySelectList:'/DevicePolicyManage/getPolicySelectList',//获取策略列表
    updateDevicePolicy:'/DevicePolicyManage/updateDevicePolicy',//更新设备策略表
    getDataHistory:'/deviceDataManage/getDataHistory',//获取设备历史数据
    deviceTurn: '/deviceDataManage/deviceTurn',//开关设备
    getDeviceSelect:'/deviceDataManage/getDeviceSelect',//获取设备选择列表
    getDeviceGroupList:'/deviceGroupManage/getDeviceGroupList',//获取设备类别列表
    addDeviceGroup:'/deviceGroupManage/addDeviceGroup',//添加设备类别
    updateDeviceGroup:'/deviceGroupManage/updateDeviceGroup',//更新设备分类
    delDeviceGroup:'/deviceGroupManage/delDeviceGroup',//删除设备分类
    getGroupSelectList:'/deviceGroupManage/getGroupSelectList',//获取设备分类类别列表
    getDeviceBindList:'/deviceBindManage/getDeviceBindList',//获取设备绑定列表
    setDeviceBind: '/deviceBindManage/setDeviceBind',//绑定设备和更新绑定
    getProductList:'/productManage/getProductList',//获取产品列表
    getProductSelectList:'/productManage/getProductSelectList',//获取产品品类在阿里云上面的选择列表
    addProduct:'/productManage/addProduct',//添加产品，同时同步到阿里云平台
    getSingleProduct:'/productManage/getSingleProduct',//通过产品id查询单个产品详情
    delProduct:'/productManage/delProduct',//删除(逻辑删除)产品
    getProSelectList:'/productManage/getProSelectList',//s设备选择产品列表
}
const base=()=>{
    let api={};
    for(let k in APILIST){
        api[k]=baseURL+APILIST[k];
    }
    return api;

}
export default{
    INTERFACES:base()
}