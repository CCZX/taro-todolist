
export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0
}

// 平闰年
export const isLeapYear = () => {
  const year = new Date().getFullYear()
  if (year % 400 === 0) {
    return true
  } else if (year % 4 === 0 && year % 100 !== 0) {
    return true
  } else {
    return false
  }
}

// 换取_openid
export const loginAndGetOpenid = (userInfo) => {
  return new Promise((resolve, reject) => [
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('login cloud',res)
        const { openid } = res.result
        const db = wx.cloud.database()
        db.collection("users").where({
          openid
        }).get({
          success: res => {
            const { data } = res
            if (data.length === 0) {
              db.collection("users").add({
                data: {
                  openid,
                  ...userInfo
                },
                success: () => {
                  resolve({openid, ...userInfo})
                  // toast('登录成功', 'success', 1000)
                  // const val = JSON.stringify({openid, ...userInfo})
                  // Taro.setStorage({ key: 'userInfo', data: val })
                  // console.log('set ok')
                }
              })
            } else {
              resolve({openid, ...userInfo})
            }
          },
          fail: () => {
            // toast('出了点状况', 'none', 1000)
            reject({openid, ...userInfo})
          }
        })
      },
      fail: (err) => {
        reject(err)
      }
    })
  ])
}
