angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats, $cordovaDeviceMotion, $cordovaMedia) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var archivosAudio ={
    arriba:"arriba.amr",//0-0-10
    abajo:"abajo.amr",//0-0- -10
    derecha:"derecha.amr",//-10,0,0
    izquierda:"izquierda.amr",//10,0,0
    parado:"parado.amr"//0,10,0
  };
  var src = "arrba.amr"
  var media = "";
  var devMot = $cordovaDeviceMotion;
 
  $scope.position={
    x:0,y:0,z:0
  };
  $scope.filename =""
  $scope.grabar = function(){
    devMot.getCurrentAcceleration().then(function(result) {
      $scope.position = result;
      $scope.filename = getFileName(result)
    media =$cordovaMedia.newMedia($scope.filename);
    media.startRecord();
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.guardarJson=function(){
    media.stopRecord();
  }
 $scope.play=function(){
    media.play();
  }

  function getFileName(position){
    if(getAbsDirection(position.x)&&getAbsDirection(position.y)&&(position.z>5)){
      return archivosAudio.arriba;
    }
    else if(getAbsDirection(position.x)&&getAbsDirection(position.y)&&(position.z<-5)){
      return archivosAudio.abajo;
    }
    else if(getAbsDirection(position.y)&&getAbsDirection(position.z)&&(position.x<-5)){
      return archivosAudio.derecha;
    }else if(getAbsDirection(position.y)&&getAbsDirection(position.z)&&(position.x>5)){
      return archivosAudio.izquierda;
    }else if(getAbsDirection(position.x)&&(!getAbsDirection(position.y))&&getAbsDirection(position.z)){
      return archivosAudio.parado;
    }
  }
  function getAbsDirection(val){
    if(Math.abs(val)<5){
      return true;
    }
    else return false
  }
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
