const axios = require('axios')
const CryptoJS = require('crypto-js')

class A  {
    constructor (sessionId) {
        this._sessionId = sessionId
        this._key = CryptoJS.enc.Latin1.parse(sessionId.substr(0, 16))
    }
    async post(name, params = {}) {
        params['base_req'] = {
            session_id: this._sessionId,
            fast: 1
            // client_info: { "platform": "android", "brand": "Xiaomi", "model": "MIX 2", "system": "Android 7.1.1" }
        }
        const resp = await axios.post(`https://mp.weixin.qq.com/wxagame/${name}`, params, {
            headers: {
                referer: 'https://servicewechat.com/wx7c8d593b2c3a7703/3/page-frame.html',
                'User-Agent': 'MicroMessenger/6.6.1.1200(0x26060132) NetType/WIFI Language/zh_CN',
                Host: 'mp.weixin.qq.com'
            }
        })
        return resp.data
    }
    encode(data) {
        const encrypted = CryptoJS.AES.encrypt(data, this._key, { 
            iv: this._key, 
            mode: CryptoJS.mode.CBC, 
            padding: CryptoJS.pad.ZeroPadding 
        })
        const r = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        return r
    }
    decode(data) {
        var encrypted = CryptoJS.AES.decrypt(data, this._key, { 
            iv: this._key, 
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding 
        })
        return encrypted.toString(CryptoJS.enc.Utf8)
    }
    format(data) {
        let jsonStr = JSON.stringify(data)
        const len = 16 - jsonStr.length % 16
        jsonStr += new Buffer([len]).toString('utf8').repeat(len)
        return jsonStr
    }
    settlement (data) {
        const action_data = this.encode(this.format(data))
        return this.post('wxagame_settlement', { action_data })
    }
}

module.exports = A