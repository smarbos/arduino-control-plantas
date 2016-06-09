function mySocket(socketFactory){
    return socketFactory();
}

mySocket.$inject = ['socketFactory'];
myApp.factory('mySocket', mySocket);
