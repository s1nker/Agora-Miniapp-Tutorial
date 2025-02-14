# Agora Miniapp Tutorial

*其他语言版本：[简体中文](README.CN.md)*

## Introduction

Built upon the Agora Miniapp SDK, the Agora Miniapp Sample App is an open-source demo that integrates video chat and live broadcast into your Wechat Mini Application.

With this sample app, you can:

* Integrate the Agora Miniapp SDK
* Join a channel
* Push your local stream to the channel
* Subscribe to remote streams in the same channel
* Leave a channel

## Preparing the Developer Environment

1. Ensure that you have installed the WeChat Developer Tool.
2. Ensure that you have a wechat OpenPlatform account that supports **live-pusher** and **live-player**. Only certified corporate accounts in certain industry have access to these two components. For details, click [here](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html) .
3. Ensure that you have granted access to the following domains in your OpenPlatform account:

 * https://miniapp.agoraio.cn
 * wss://miniapp.agoraio.cn

## Running the App
 
1. Create a developer account at [Agora.io](http://dashboard.agora.io/signin/), create a new project and obtain an App ID, and enable the App Certificate.
2. Download this project.
3. Fill in the App ID in *config.js* in the *utils* folder of this project:

    	const APPID = 'abcdefg'
    	
4. Contact sales@agora.io to abtain the Agora Miniapp SDK, and rename the SDK to "mini-app-sdk-production.js".
5. Save the "mini-app-sdk-production.js" under the *lib* folder of this project.
6. Start the WeChat Developer Tool and import this project.
7. Enter a channel name and join a channel. Invite your friend to join in the same channel and you will be able to see each other.

## About the Token/Dynamic Key

If you have enabled the App Certificate, you will need to generate the Token/Dynamic Key at the server for authentication purposes. Use it in the following method:

    	//...
    	client.join(<your key/access token here>, channel, uid, () => {
    	//...
    	
See [Token](https://docs.agora.io/en/2.2/product/Video/Agora%20Basics/key_native?platform=Android) or [Dynamic Key](https://docs.agora.io/en/2.2/product/Video/Agora%20Basics/key_web?platform=Web) for generating the Token or Key at the server.

## Feedback

If you have any problems or suggestions regarding the sample projects, feel free to file an [issue](https://github.com/AgoraIO/Agora-Miniapp-Tutorial/issues).

## Related resources

- Check our [FAQ](https://docs.agora.io/en/faq) to see if your issue has been recorded.
- Dive into [Agora SDK Samples](https://github.com/AgoraIO) to see more tutorials
- Take a look at [Agora Use Case](https://github.com/AgoraIO-usecase) for more complicated real use case
- Repositories managed by developer communities can be found at [Agora Community](https://github.com/AgoraIO-Community)
- If you encounter problems during integration, feel free to ask questions in [Stack Overflow](https://stackoverflow.com/questions/tagged/agora.io)

## License

The sample projects are under the MIT license.
