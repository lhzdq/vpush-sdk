/**
 * vPush - 专业高效实用的微信小程序推送平台
 * -------------------------------------
 * 官网： https://vpush.cloud
 * 项目： https://github.com/safe-dog 
 * 版本： 20180708
 */

class vPush {
  constructor(appId) {
    this.APP_ID = appId;
    this.HOST = 'https://vpush.safedog.cc';
    this.ADD_API = this.HOST + '/add/formId';
    this.TAG = [];
    this.ALIAS = '';
  }

  // 兼容vpush-sdk-img
  init (page) {}

  /**
   * 获取微信用户凭证
   */
  getCode (callback) {
    wx.login({
      success: ret => {
        callback(ret.code)
      }
    })
  }

  /**
   * post数据
   */
  post (url, data, callback) {
    wx.request({
      url,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(data),
      success: callback,
      fail: callback
    })
  }

  // 检查是否已经开启推送
  isOpenPush (callback) {
    this.getCode(code => {
      this.post(this.HOST + '/push/' + this.APP_ID + '/status', { code }, ret => {
        if (ret.data.code === 1) return callback(ret.data.open);
        callback(false, ret.data.message);
      })
    })
  }

  /**
   * 开启推送
   */
  openPush (callback) {
    this.getCode(code => {
      this.post(this.HOST + '/push/' + this.APP_ID + '/open', {
        code
      }, ret => {
        if (ret.data.code === 1) return callback(true);
        callback(false, ret.data.message);
      })
    })
  }

  /**
   * 关闭推送
   */
  closePush (callback) {
    this.getCode(code => {
      this.post(this.HOST + '/push/' + this.APP_ID + '/close', {
        code
      }, ret => {
        if (ret.data.code === 1) return callback(true);
        callback(false, ret.data.message);
      })
    })
  }

  /**
   * 设置短标签
   */
  setAlias(alias) {
    this.ALIAS = alias;
  }

  /**
   * 设置tag标签
   * tag，可以是string，也可以是array
   */
  setTag(tag) {
    if (typeof tag === 'string') {
      this.TAG = [tag];
    } else if (Array.isArray(tag)) {
      this.TAG = tag;
    } else {
      throw new Error('tag 应为string或array类型！')
    }
  }

  /**
   * 添加formid
   */
  add(e, callback) {
    var formId = e;
    if (typeof e === 'object') formId = e.detail.formId;
    if (!callback) callback = () => null;
    if (formId.startsWith('the')) {
      console.log('[DEBUG FORMID]');
      return callback();
    }
    var info = wx.getSystemInfoSync();
    this.getCode(code => this.post(this.ADD_API, {
      code,
      appId: this.APP_ID,
      formId,
      sdk: info.SDKVersion,
      language: info.language,
      model: info.model,
      platform: info.platform,
      system: info.system,
      version: info.version,
      // alias && tags
      alias: this.ALIAS,
      tags: this.TAG
    }, callback));
  }
}

module.exports = vPush;