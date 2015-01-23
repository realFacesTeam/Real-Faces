# Future Impovements

This file contains a list of possible future features and improvements that could be implemented. They are roughly ordered by most difficult/time consuming first.

## Centralized WebRTC architecture

At the moment, the app uses peer to peer media streaming. This is pretty much free to provide but it suffers from upload bandwidth restrictions as each user must stream their video/audio to each other user indiviually. A centralized architecture using some form of media server would greatly increase the number of users that could stream to each other. The node-webrtc may be able do this without requiring any other programming languages.

## 3D sound

Add positonal and directional audio so that clients can hear what direciton another is. This is currently only possible in FireFox, due to peer media stream incompatibility with Web Audio API, so probably not worth the time.

## Cropping via facial detection

Open source JavaScript facial detection packages are available (https://github.com/auduno/clmtrackr), which could be used to crop the parts of the video around the face. This video could then be rendered onto an otherwise invisible screen head and it would give the impression of a floating head above the body!

## Private rooms

Add the ability to make private rooms that the user could invite people to by sharing a generated URL.

## Create user Accounts

Either create user accounts or use a google/facebook/twitter sign in.

## Customisatble characters

Have the characters be customisable. An option that automatched the color of top the person was wearing could also be implemented.

## Detection and notification of lacking requirements

The app would detect if the users computer or internet were not suitable for the app and show them the appropriate message.

## Slighty outwards curve on face screens

This would allow a degree of vibility to people look from the side on, more similar to real life.

## Remove the prompt from WebRTCMain

The name request prompt is ugly and blocks the script. This should be changed for a more attractive, ansyncronous method of getting the user name.

## Fix the SimpleWebRTC prototype overwrite

This is a confusing way to change the method that was used to fix a bug under time pressure but should be changed for a more established overwrite technique.

