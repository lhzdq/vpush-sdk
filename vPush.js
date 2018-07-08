class vPush {
  constructor(appId) {
    this.APP_ID = appId;
    this.API = 'https://vpush.safedog.cc/add/formId';
    this.TAG = [];
    this.ALIAS = '';
  }

  // 兼容vpush-sdk-img
  init (page) {}

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
    if (formId.startsWith('the')) {
      console.log('[DEBUG FORMID]');
      return callback();
    }
    wx.login({
      success: ret => {
        var { code } = ret;
        var info = wx.getSystemInfoSync();
        wx.request({
          url: this.API,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            appId: this.APP_ID,
            code,
            formId,
            sdk: info.SDKVersion,
            language: info.language,
            model: info.model,
            platform: info.platform,
            system: info.system,
            version: info.version,
            // alias && tags
            alias: this.ALIAS,
            tags: this.TAGS
          }),
          success: callback,
          fail: callback
        });
      }
    });
  }
}

module.exports = vPush;