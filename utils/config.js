// const APPID = "272238450a764397b0aa3a10acbdda58";
const APPID = "4a69f07b0bb54f1a9aca890958261e1f";

if(APPID === ""){
  wx.showToast({
    title: `请在config.js中提供正确的appid`,
    icon: 'none',
    duration: 5000
  });
}

module.exports = {
  APPID: APPID
}