importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyAotsYIQ_Sw_YeabR7UfZShCE18UaBoYZ0",
  authDomain: "royal-thikana.firebaseapp.com",
  projectId: "royal-thikana",
  storageBucket: "royal-thikana.appspot.com",
  messagingSenderId: "982411461740",
  appId: "1:982411461740:web:24ae8f16b7807522d00449",
  measurementId: "G-GC3HYWJ5XR"
};
const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    // console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
}