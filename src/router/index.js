//引入Vue
import Vue from 'vue';
//引入vue-router
import Router from 'vue-router';
//主框架
import Index from '../components/index/Index.vue';
//登录
import Login from '../components/pages/Login.vue';
//主页
import Home from '../components/pages/Home.vue';

//管理页面
import UserManage from '../components/pages/manage/UserManage.vue';
import RoleManage from '../components/pages/manage/RoleManage.vue';
import MenuManage from '../components/pages/manage/MenuManage.vue';
import AppManage from '../components/pages/manage/AppManage.vue';

//即时通讯模块
import MainIm from '../components/pages/im/MainIm.vue';
import CountsIm from '../components/pages/im/CountsIm.vue';

//通用信息
import FqMange from '../components/pages/config/FqMange.vue';
import NoticeManage from '../components/pages/config/NoticeManage.vue';

//其他信息
import CountMes from '../components/pages/other/user/CountMes.vue';
import UsersManage from '../components/pages/other/user/UserManage.vue';
import ShoppingManage from '../components/pages/other/user/ShoppingManage.vue';
import TiXianManage from '../components/pages/other/user/TiXianManage.vue';
import TuanDuiUser from '../components/pages/other/user/TuanDuiUser.vue';
import LogWalletUser from '../components/pages/other/user/LogWalletUser.vue';
import SodManage from '../components/pages/other/user/SodManage.vue';
import SodBillManage from '../components/pages/other/user/SodBillManage.vue';
import SodBillAllManage from '../components/pages/other/user/SodBillAllManage.vue';

import ChartCountIm from '../components/pages/count/ChartCountIm.vue';
import LineChart from '../components/pages/count/LineChartIm.vue';
import DataDisplay  from '../components/pages/count/DataDisplay .vue';

import OnlineService from '../components/pages/im/OnlineService.vue'

import CountLine from '../components/pages/count/CountLine.vue'
//商城管理
import Brand from '../components/pages/mall/brand.vue'
import Classify from '../components/pages/mall/classify.vue'
import Banner from '../components/pages/mall/banner/banner.vue'
import specification from '../components/pages/mall/specification/specification.vue'
import StandardValue from '../components/pages/mall/specification/StandardValue.vue'
import Store from '../components/pages/mall/store/Store.vue'
import SUkRepertory from '../components/pages/mall/SUK_repertory/SUK_repertory.vue'
import Shipments from '../components/pages/mall/shipments/Shipments.vue'

Vue.use(Router); //Vue全局使用Router
const router = new Router({
	//配置路由，这里是个数组
	routes: [{
			path: '/', //链接路径
			name: 'login', //路由名称，
			component: Login, //对应的组件模板
		},
		{
			path: '/', //链接路径
			name: 'index', //路由名称，
			component: Index, //对应的组件模板
			// 需要登录才能进入的页面可以增加一个meta属性
			meta: {
				requiresAuth: true
			},
			children: [
				{
					//主页模块
					path: '/index', //链接路径
					name: 'index', //路由名称
					components: {
						home: Home,
						userManage: UserManage,
						roleManage: RoleManage,
						menuManage: MenuManage,
						appManage: AppManage,
						mainIm: MainIm,
						countsIm: CountsIm,
						fqMange: FqMange,
						noticeManage: NoticeManage,
						countMes: CountMes,
						usersManage: UsersManage,
						shoppingManage: ShoppingManage,
						tiXianManage: TiXianManage,
						tuanDuiUser: TuanDuiUser,
						logWalletUser: LogWalletUser,
						sodManage: SodManage,
						sodBillManage: SodBillManage,
						sodBillAllManage: SodBillAllManage,
						chartCountIm: ChartCountIm,
						lineChart: LineChart,
						dataDisplay: DataDisplay,
						brandAdmin: Brand,
						classifyAdmin: Classify,
						onlineService: OnlineService,
						countLine: CountLine,
						banner: Banner,
						specification: specification,
						specification_value: StandardValue,
						store: Store,
						SUkRepertory: SUkRepertory,
						shipments: Shipments
					}
				}
			]
		},
		{
			path: '*', //链接路径
			name: 'login', //路由名称，
			component: Login, //对应的组件模板
		}
	]
});

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
	// 判断是否需要登录权限
	if (to.matched.some(res => res.meta.requiresAuth)) {
		//判断是否登录
		if (sessionStorage.getItem('token') != null) {
			next();
		} else {
			// 没登录则跳转到登录界面
			next({
				path: '/',
				query: {
					redirect: to.fullPath
				}
			});
		}
	} else {
		next();
	}
});
export default router;
