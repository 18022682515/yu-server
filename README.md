# yu-server
nodejs服务器框架

框架功能：  
1、实现webSocket，(服务器主动向浏览器端推送消息);  

2、实现redis储存session，请查看config文件，调用方法：ctx.session.set(key,val) | get(key) | delete(key)	返回promise;

3、实现日志功能;  

4、实现csrf防御;  

5、实现定时任务模块，在appTask目录的tasks.js中添加任务，管理任务：app.tasks[i]是任务对象，对象方法参考模块cron;

6、实现mysql，在config.js中配置账户等，调用方法：app.mysql.query('sql语法')	 返回promise;  

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
