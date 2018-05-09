import firebase from 'firebase';
// Initialize Firebase
const config = {
    apiKey: 'AIzaSyDvfZCc7FilAiEl8YmldkeoLCPegumw_Gk',
    authDomain: 'hpcm-fdb43.firebaseapp.com',
    databaseURL: 'https://hpcm-fdb43.firebaseio.com',
    projectId: 'hpcm-fdb43',
    storageBucket: 'hpcm-fdb43.appspot.com',
    messagingSenderId: '1053061214496'
};
const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;