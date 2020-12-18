import Vue from 'vue'
import Vuex from 'vuex'
 
Vue.use(Vuex)
 
export default new Vuex.Store({
    state: {
        websock: null,
        eventlist:[]
    },
    getters: {
        onEvent(state) {
            return function (method) {
                let index = state.eventlist.map((eb) => {return eb.method}).indexOf(method);
                if (state.eventlist.length > 0 && index >= 0) {
                    let result = Object.assign({}, state.eventlist[index]);
                    state.eventlist.splice(index, 1);
                    return result.data;
                }
                return null;
            }
        }
    },
    mutations: {
        WEBSOCKET_INIT(state,url) {
            state.websock = new WebSocket(url);
            state.websock.onopen = function () {
                console.log("连接成功！");
            }
            state.websock.onmessage = function (callBack) {
				console.log("--------websockmes--------"+callBack.data); 
				var data = JSON.parse(callBack.data);
				state.eventlist.push({
				    method: data.method,
				    data: data.jsonData
				})
            }
            state.websock.onerror=function(e) { //错误
                console.log("ws错误!");
                console.log(e);
            }
            state.websock.onclose=function(e) { //关闭
                console.log("ws关闭！");
                console.log(e);
            }
            //发送心跳包
            setInterval(function() {
                console.log("------发送心跳------");
                var mes={
                    method: "pant",
                    jsonData:{}
                };
                state.websock.send(JSON.stringify(mes));
            }, 50000);
        },
        WEBSOCKET_SEND(state, mes) {
            console.log("ws发送！-------"+JSON.stringify(mes));
            state.websock.send(JSON.stringify(mes));
        }
    },
    actions: {
        WEBSOCKET_INIT({commit},url) {
            commit('WEBSOCKET_INIT',url)
        },
        WEBSOCKET_SEND({commit}, mes) {
            commit('WEBSOCKET_SEND', mes)
        }
    }
})