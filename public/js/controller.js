function ArduController($scope, mySocket) {
    $scope.log = [];
    $scope.valorHumedadActual = null;
    $scope.valorLuzActual = null;
    if(window.localStorage.getItem('registroHistorico')){
        $scope.log = JSON.parse(window.localStorage.getItem('registroHistorico'));
        $scope.valorHumedadActual = $scope.log[$scope.log.length-1].valorHumedad;
        $scope.valorLuzActual = $scope.log[$scope.log.length-1].valorLuz;
    }
    mySocket.on('pop', function (data) {
        if(data.valorHumedad){
            console.log(data);
                newItem = {

                    valorTiempo: Date.now(),
                    valorLuz: Math.round(data.valorLuz),
                    valorHumedad: Math.round(data.valorHumedad)
                }
                $scope.log.push(newItem);
                window.localStorage.setItem('registroHistorico', JSON.stringify($scope.log));
                $scope.valorHumedadActual = $scope.log[$scope.log.length-1].valorHumedad;
                $scope.valorLuzActual = $scope.log[$scope.log.length-1].valorLuz;
        }

      });


}
ArduController.$inject = ['$scope', 'mySocket'];
myApp.controller('ArduController', ArduController);
