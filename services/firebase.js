// import { initializeApp } from "firebase/app";
// import { getMessaging } from "@firebase/messaging";

// export const firebaseConfig = {
//   apiKey: "AIzaSyAotsYIQ_Sw_YeabR7UfZShCE18UaBoYZ0",
//   authDomain: "royal-thikana.firebaseapp.com",
//   projectId: "royal-thikana",
//   storageBucket: "royal-thikana.appspot.com",
//   messagingSenderId: "982411461740",
//   appId: "1:982411461740:web:24ae8f16b7807522d00449",
//   measurementId: "G-GC3HYWJ5XR",
// };

// app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
// export default app;
// console.log(messaging)


import { initializeApp } from 'firebase/app';
var firebaseConfig = {
    apiKey: "AIzaSyAotsYIQ_Sw_YeabR7UfZShCE18UaBoYZ0",
    authDomain: "royal-thikana.firebaseapp.com",
    projectId: "royal-thikana",
    storageBucket: "royal-thikana.appspot.com",
    messagingSenderId: "982411461740",
    appId: "1:982411461740:web:24ae8f16b7807522d00449",
    measurementId: "G-GC3HYWJ5XR",
};

export const firebaseApp = initializeApp(firebaseConfig);

// const messaging =  firebase.messaging()(firebaseApp);

// export const fetchToken = (setTokenFound) => {
//     return getToken(messaging, {vapidKey: 'BMfBN0pzzkOsJ1lMk7pWGi4RJ4CYwS_EYzS-kfHU-efROryUL8Qi9oHufm8WNSlcKmeLlAl7zmVNZxYbRtdh8-4'}).then((currentToken) => {
//         if (currentToken) {
//             console.log('current token for client: ', currentToken);
//             // setTokenFound(true);
//             // Track the token -> client mapping, by sending to backend server
//             // show on the UI that permission is secured
//         } else {
//             console.log('No registration token available. Request permission to generate one.');
//             // setTokenFound(false);
//             // shows on the UI that permission is required
//         }
//     }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         // catch error while creating client token
//     });
// }

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             resolve(payload);
//         });
//     });
