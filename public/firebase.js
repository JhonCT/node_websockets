//id cliente = 
//secret = vidAQupX4kfq0lVO0dammvk2
let contacts = document.getElementById('contacts');

var firebaseConfig = {
    apiKey: "AIzaSyCsx7NKNc4hj0YAS1hRz8a7PZqblr55HIY",
    authDomain: "qwe-f9833.firebaseapp.com",
    databaseURL: "https://qwe-f9833.firebaseio.com",
    projectId: "qwe-f9833",
    storageBucket: "qwe-f9833.appspot.com",
    messagingSenderId: "1088296702478",
    appId: "1:1088296702478:web:11c6d1a5687640c5bba25f"
};

firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    var user = result.user;
    localStorage.setItem("user", JSON.stringify(user));
    saveUser(user);    
}).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
});

function saveUser(user) {
    fetch("/user/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(res => res.json()).then(res => console.log(res));
}
