// 生产服务器
const prod = {
    version: '1.0.0',
    production: true,

    // 后端服务
    api_endpoint: 'https://example.com',
    socket_endpoint: 'wss://example.com:6003',
    file_upload_endpoint: 'https://example.com/upload',

    // 小程序数据存储前缀
    storage_prefix: ''
}

// 线上测试服务器
const staging = Object.assign({}, prod, {
    production: false,

    // 后端服务
    api_endpoint: 'https://staging.example.com',
    socket_endpoint: 'wss://staging.example.com:6003',
    file_upload_endpoint: 'https://staging.example.com/upload',

    // 小程序数据存储前缀
    storage_prefix: 'staging_'
})

// 环境切换, prod 或 staging
const environment = staging

export default environment
