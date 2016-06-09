// server.js
var express        = require('express');
var app            = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five"),
  board, photoresistor;
var io=require('socket.io')(httpServer);

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);

var led;
var sensor

//Arduino board connection

var board = new five.Board();
board.on("ready", function() {
    console.log('Arduino connected');
    led = new five.Led(13);
    sensor = new five.Sensor("A0");
    // led = new five.Led.RGB({
    //     pins: {
    //       red: 6,
    //       green: 5,
    //       blue: 3
    //     },
    //     isAnode: true
    // });

    photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
    });
});

A = 1000;     //Resistencia en oscuridad KO
B = 15;        //Resistencia a la luz (10 Lux) KO
Rc = 10;       //Resistencia calibracion KO
luz = 0;
//Socket connection handler
io.on('connection', function (socket) {
        console.log(socket.id);

        // Maximo valor luz 800
        // Minimo valor luz 200
        function sensar() {
          console.log('['+new Date+']');
          tiempo = new Date;
          ilum = (luz*A*10)/(B*Rc*(1024-luz));
          socket.emit('pop', { valorTiempo: tiempo, valorLuz: luz, valorHumedad: humedad, ilum: ilum });
          if(luz <= 500){
              prenderLuz();
          }
          else{
              apagarLuz();
          }
        }
        setInterval(sensar, 60 * 1000);

        function prenderLuz(){
            led.on();
            console.log("prenderLuz");
            socket.emit('pop', { accion: prenderLuz });
        }

        function apagarLuz(){
            led.off();
            console.log("apagarLuz");
            socket.emit('pop', { accion: apagarLuz });
        }

    sensor.on("data", function() {
        humedad = this.value;
    });

    photoresistor.on("data", function() {
        console.log(luz = this.value);
        luz = this.value;
    });


        socket.on('led:on', function (data) {
           led.color(data.led);
           console.log(data);
           console.log('LED ON RECEIVED');
        });

        socket.on('led:off', function (data) {
            led.off();
            console.log(data);
            console.log('LED OFF RECEIVED');
        });

    });

console.log('Waiting for connection');
