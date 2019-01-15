/**
 * 配置文件
 */

//  var host = 'localhost:1111';
  //  var host = 'http://www.ganjie.com:5980';
  var host = 'https://51redis.xyz';
var config = {
    login:0,//是否要求登陆
    service: {
        host,
        // 登录地址，用于建立会话
        // loginUrl: `http://${host}/login`,
        // loginUrl: `https://${host}/WxLogin`,
        loginUrl: `${host}/WxLogin`,
        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,
        // 测试的信道服务地址
        tunnelUrl: `${host}/tunnel`,
    }
};

module.exports = config;