## vPush SDK

> [vPush](https://vpush.cloud)是一个专业高效实用的微信小程序推送平台


## 配置
这个sdk是需要在微信小程序设置后台配置一下域名的，如果觉得懒，可以尝试考虑一下我们的黑科技：[vpush-img-sdk]()


登陆[微信小程序管理平台](https://mp.weixin.qq.com)，然后点击【设置】->【开发设置】->【服务器域名】->【修改】

然后`request合法域名`添加我们的推送后端地址：

```https://vpush.safedog.cc```

![vPush配置域名](https://i.loli.net/2018/07/12/5b47385630abf.png)

## 安装
首先，进入小程序目录，然后把该项目下载回小程序的`libs/`或者`utils/`或者其他自建模块目录。

```cmd
> cd weapp\libs
> git clone https://github.com/safe-dog/vpush-sdk.git
```

然后，在`app.js`文件中引入并初始化为全局变量：

``` js
var vPush = require('./libs/vpush-sdk/vPUsh.js');

App({
  vPush: new vPush('vPushAppId'),
  onLoad: function () {}
  // ...
})
```

这里的初始化参数，为在[vPush开发者平台](https://dev.vpush.cloud)中添加的应用ID，你可以在开发者面板中找到。

![vPush代码配置](https://i.loli.net/2018/07/12/5b473d549d06f.png)

## 使用

以上配置安装好后，就可以在小程序的任意页面进行调用`vPush`API了。    
在`page`页面中，可以通过如下代码获取到`vPush`变量：

``` js
// pages/detail.index.js
var { vPush } = getApp();

Page({
  data: {}
  // ...
})
```

### 获取用户推送状态
> 判断用户是否开启/关闭了推送

``` js
vPush.isOpenPush(open => {
  // open=true则是打开了
})
```

### 用户打开推送
> 用户点击打开推送开关，就调用此API

``` js
vPush.openPush(success => {
  // success=true则是打开成功
})
```

### 用户关闭推送
> 如果用户不喜欢向他推送消息，那么久可以设置开关，点击关闭后，调用此API

``` js
vPush.closePush(success => {
  // success=true则关闭成功
})
```

### 设置别名
> 设置别名，可以让开发者在推送的时候指定发送给那个用户。

``` js
vPush.setAlias('test-user');
```

### 设置tag标签
> tag标签可以用来进行用户群分类。

``` js
vPush.setTag('tag-name');
vPush.setTag(['group1', 'group2']);
```

## 添加推送凭证
> 这个是整个SDK的重点功能，只有添加了用户的推送凭证，开发者才能向用户推送模板消息。

``` js
vPush.add(formId, () => {
  console.log('add ok')
});
```

**那么，如何获取推送凭证？**

参考[微信开发文档-模板消息](https://developers.weixin.qq.com/miniprogram/dev/api/notice.html)，可以发现，我们需要创建一个`report-submit=true`的`form`容器，然后再添加一个`form-type="submit"`的`button`组件，才能通过监听事件获取到`formId`值。

当然，如果只是通过用户主动点击按钮去收集formId的话，效率会不是很高，至少很难收集到适量的用户推送凭证。    
所以我们可以变着法子，在页面的任何UI组件，都可以通过在外嵌套一个收集`formId`的容器，以最大化地让用户地每一次点击都有效。

说太多无聊，还是用代码解释吧！

比如[一ONE](https://github.com/safe-dog/one)这个小程序，我就在很多地方都布局了收集`formId`的容器，比如主体内容，`wxml`代码如下：

``` xml
<form report-submit bindsubmit='viewHandler' data-item='{{first}}'>
  <button form-type='submit'>
      <!--vol标题  -->
      <view class='first_title_box'>
        <text>{{first.title}}</text>
      </view>
      <!--内容  -->
      <view class='first_content_box'>
        <text>{{first.content}}</text>
      </view>
      <!--作者  -->
      <view class='first_author_box'>
        <text>—— {{first.text_authors}}</text>
      </view>
  </button>
</form>
```
当然，`form`和`button`组件的样式是必须重写的，不然会影响原UI，我这里直接给设置隐藏了：

``` css
button {
  padding: 0;
  font-size: auto;
  line-height: 26px;
  text-align: left;
  overflow: none;
  border-radius: 0;
  box-sizing: none;
  background: transparent;
}
button::after {
  background: transparent;
  border: none;
  border-radius: 0;
}
.button-hover{
  background: transparent;
}
```
这样一个UI就布局好了，我们只需要在`viewHandler`这个点击事件里，做如下两件事就可以：
1. 调用`vPush.add`添加推送凭证
2. 继续点击的操作，比如跳转页面等

``` js
Page({
  data: {},

  viewHandler: function (e) {
    // 添加凭证
    vPush.add(e);
    // 跳转页面
    var { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + item.id
    })
  },
  // ...
})
```

> 提示：在开发者工具里调用这个函数，不会发送到服务端，因为开发者工具中的`formId`为调试用的ID，并没有用。


## 最后
感谢花费那么多时间把这篇用心整理的文档阅读完毕，其实SDK的集成和使用很简单，我们更应该去关心的是推送的API使用等。    
这里就不一一描述了，你可以通过如下资源去了解更多：

1. [vPush官网: vpush.cloud](https://vpush.cloud)
2. [vPush开发文档: doc.vpush.cloud](https://doc.vpush.cloud)
3. [vPush开发者中心: dev.vpush.cloud](https://dev.vpush.cloud)

还有我们的付费技术咨询问答以及最新体验会员服务交流圈子：
![](https://vpush.cloud/static/qr.png)

## 帮助
> 如果你遇到了解决不了的问题，或者想一起研究探讨更多有意思的产品，以及小程序开发相关的任何帮助，都可以通过扫描下方二维码加入我们，获取专业的技术支持！

![](https://vpush.cloud/static/qr.png)