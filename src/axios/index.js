//引入Vue
import Vue from 'vue';
//axios
import Axios from 'axios';
//qs
import Qs from 'qs'

const instance = Axios.create({
  baseURL: '', // api的base_url
  timeout: 600000, // 请求超时时间  headers: { 'content-type': 'application/x-www-form-urlencoded' }//头部信息
})
//POST传参序列化(添加请求拦截器)
instance.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post'){
		config.data = Qs.stringify(config.data);
    }
    return config;
},(error) =>{
    // Message({
    //     type: 'error',
    //     message: "错误的传参"
    // })
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
instance.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(res.data.retcode == 200){
        return res
    }else {
        // Message({
        //     type: 'error',
        //     message: res.data.retmsg
        // })
        // return Promise.reject(res);
        return res;
    }
}, (error) => {
    // Message({
    //     type: 'error',
    //     message: "网络异常"
    // })
    return Promise.reject(error);
});
export default instance;