# Application Flow

This page describes the process of the Application at a high level.

## Index

The index page and other pages linked in the navbar (e.g. Contact) are simple static html pages generated from jade files.

## 3D Scenes

Once a scene has been selected on the index page, static/js/main.js initializes the App. The 3D environment is built with the Three.js abstraction over webGL. The initialization functions for this are in static/js/3DComponents/threemain.js and helper functions are in the same directory.

The syncing of player movements in the scene between clients is done via socketIO. On the client side this is handled in static/js/socketMain.js and the socketIO server is located sockets/translations.js. Tweening is used to smooth other player movements between socket updates.

## Video Audio Streaming

Media Streams are transmitted peer to peer via WebRTC. This is initialized via the RealWebRTC constructor in static/js/webRTCCompnents/webRTCMain.js. Once the streams have been established the socket ID of each client is sent to other users via the a WebRTC data channel, which allows other clients to match video streams to player avatars (which have their socket ID as part of their name).

Once the videos are matched with their corresponding avatar, videos are rendered on the face of each avatar in the WebGL canvas by using the video element in the dom as a texture.
