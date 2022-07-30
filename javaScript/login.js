// login
document.getElementById('formLogin').addEventListener('submit',(e) => 
{
    e.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    //firebase has a authentication system with email and password
    const promise = firebase.auth().signInWithEmailAndPassword(username, password);

    promise.then((userCredential) => 
    {
        const user = userCredential.user;
        alert("User successfully logged in.");
        location.href = 'userPage.html' 
    }).catch((error) => 
    {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
});

// sign up
document.getElementById('formSignUp').addEventListener('submit',(e) => 
{
    e.preventDefault();
    
    var username = document.getElementById('usernameSignup').value;
    var password = document.getElementById('passwordSignup').value;

    //firebase also has a create user function, the user is added to the authentication tab
    firebase.auth().createUserWithEmailAndPassword(username, password).then(function()
    {
        alert("User successfully created.");
    }).catch(function(error)
    {
        var errorcode = error.code;
        var errormsg = error.msg;
        alert(errormsg);
    });
});