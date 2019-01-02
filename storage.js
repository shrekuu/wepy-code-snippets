import environment from './environment'

// 用环境前缀区分开存储键, 这样测试时就不用删除生产环境版
const Storage = {
    // 静默登录获得的 openid, unionid, sessionID
    silent_login_info_key: `${environment.storage_prefix}silent_login_info`,
    // 去后台请求数据用的 token
    api_token_key: `${environment.storage_prefix}api_token`,
    // user info
    user_info_key: `${environment.storage_prefix}user_info`,

    get(key) {
        return wx.getStorageSync(key)
    },
    set(key, value) {
        return wx.setStorageSync(key, value)
    },
    remove(key) {
        return wx.removeStorageSync(key)
    },
    clear() {
        return wx.clearStorageSync()
    }
}

export default Storage
