import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'
import appStore from './store/counter'
import './app.scss'
import 'taro-ui/dist/style/index.scss'
import { loginAndGetOpenid } from './utils/common';
// import { loginAndGetOpenid } from './utils/common'

declare const wx

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  appStore
}
wx.cloud.init({
  env: 'c2mp-auk4d'
})

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/home/index',
      'pages/add/index',
      'pages/about/index',
      'pages/list/index',
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'ToDoList',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      "list": [{
        "pagePath": "pages/home/index",
        "text": "首页",
        "iconPath": "./assets/images/home.png",
        "selectedIconPath": "./assets/images/home-active.png"
      },{
        "pagePath": "pages/list/index",
        "text": "列表",
        "iconPath": "./assets/images/cate.png",
        "selectedIconPath": "./assets/images/cate-active.png"
      },{
        "pagePath": "pages/about/index",
        "text": "我",
        "iconPath": "./assets/images/user.png",
        "selectedIconPath": "./assets/images/user-active.png"
      }]
    }
  }

  componentDidMount () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              appStore.setUserInfo(res.userInfo)
              loginAndGetOpenid(res.userInfo).then(ret => {
                Taro.setStorageSync('userInfo', JSON.stringify(ret))
              }).catch(err => {
                console.log('app err', err)
              })
            }
          })
        }
      }
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
