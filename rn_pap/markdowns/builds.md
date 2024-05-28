# Convert to APK/APP

```
npx react-native build-android --mode=release
npm run android --mode="release"
```

## Run Android e IOS

```
npx expo run:ios
npx expo run:android
```

## Clean Android Cache & Create APk

```
cd android
./gradlew clean
./gradlew assembleRelease
```

## Run IOS Dependencies

```
cd ios && pod install
```

## Create Builds for Iphone and Android using Expo Servers


```
eas build --platform ios --profile sim
```

```
eas build --platform android --profile apk
```