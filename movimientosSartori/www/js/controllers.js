angular.module('starter.controllers', ['ionic', 'ngCordova'])
.factory('login', function () {
    var logueado = false;
    var login = {};
    login.setLogueado = function (valor) {
      logueado = valor;
    };
    login.getLogueado = function () {
      return logueado;
    };
    return login;
  })

.controller('MiCuentaCtrl', ['$scope', '$state', 'login', "$ionicPopup", function ($scope, $state, login, $ionicPopup) {
    $scope.getLogueado = login.getLogueado;
    $scope.setLogueado = login.setLogueado;
    $scope.form = {}
    $scope.error = false;
    $scope.form.usuario = "";
    $scope.showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Movimientos',
        template: 'Error al iniciar sesi\u00f3n'
      });
    }
    $scope.Ingresar = function () {
      console.log("usuario: " + $scope.form.usuario);
      if ($scope.form.usuario == 1) {
        $scope.setLogueado(true);
        $state.go('tab.movimientos');
      } else {
        $scope.showAlert();
      }
    }

  }])

.controller('MovimientosCtrl', function($scope, Chats, $cordovaDeviceMotion, $cordovaMedia) {
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
  var audioAnterior = "";
  var audioActual = "";
  $scope.watch = null;
  $scope.position={
    x:0,y:0,z:0
  };

  $scope.filename ="";
  $scope.filenamePosicion = "";
  $scope.grabar = function(){
    devMot.getCurrentAcceleration().then(function(result) {
      $scope.position = result;
      $scope.filename = getFileName(result);
      $scope.filenamePosicion = $scope.filename.split('.')[0];
    media =$cordovaMedia.newMedia($scope.filename);
    media.startRecord();
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.guardarJson=function(){
    media.stopRecord();
  }
  $scope.pausar = function(){
    $scope.watch.clearWatch();
    media.stop();  
  }
 $scope.play=function(){
  if(!$scope.watch)
    $cordovaDeviceMotion.clearWatch($scope.watch);  
  var options = { frequency:1000 };
    $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
    $scope.watch.then(
      null,
      function(error) {
      // An error occurred
      },
      function(result) {
        audioAnterior = audioActual;
        audioActual = getFileName(result);
        if((audioActual != audioAnterior)&&(audioActual!="")){
          media = $cordovaMedia.newMedia(audioActual);
          media.play();
        }        
    });
    
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
    }else
      return "";
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

.controller('AcercaDeCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
