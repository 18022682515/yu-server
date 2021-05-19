# yu-server
nodejs服务器框架

框架功能：  

1、webSocket（客户端升级协议后，服务器端可主动向客户端发送消息）;

2、redis储存session（session方法：ctx.session.set(key,val) | get(key) | delete(key)，返回promose），config.js文件设置配置;

3、日志功能（日志以每天日期为一个日志目录名，分为app日志和request日志，日志等级有error、warn、info）;

4、csrf防御（document.cookie中获取，key名：_csrf）;

5、定时任务模块;

6、mysql（调用方法：app.mysql.query('sql语法').then(result=>{})），config.js文件设置配置;

## 安装yu-server
```
1、全局安装yu-init
cnpm install -g yu-init

2、创建项目
yu-init 项目名 -s

3、切换到项目根目录下
cd 项目名

4、安装项目的依赖包
cnpm install

5、启动项目
cnpm run dev

```
