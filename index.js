
var noble = require('noble');
const Promise = require('promise');
var manageBufferPM5C2Erg = require('./manageBufferPM5C2Erg');
// var manageBufferErg = require('./manageBufferErg');
// var socket = require('./socketController');
// var uuidErgService = '6965';
// var uuidErgService = '18902a9a-1f4a-44fe-936f-14c8eea41800';// '6969';
// var uuidErgCharacteristic = '6970';

// console.log(socket);
/*
function2 = function () {
	socket.emit("ergData",{msg:"hey"})
	setTimeout(function2, 200);
}

setTimeout(function2, 1);
// */
// process.exit()
/////////
console.log("REC list");
noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		console.log('scanning for Concept 2 ergs ...');
		noble.startScanning(false);
		// noble.startScanning([uuidErgService], false);
	}
	else {
		noble.stopScanning();
	}
});

// var ergService = null;
// var ergCharacteristic = null;

noble.on('discover', function(peripheral) {
	// noble.stopScanning();
	// console.log('found peripheral:', peripheral.advertisement);
	if(peripheral.advertisement && peripheral.advertisement.localName){
		const name = peripheral.advertisement.localName;
		// console.log("Found ",name);
		if(name.includes("PM5")){
			console.log("Found ",name);
			peripheral.connect(function(err) {
				// get C2 rowing primary service 
				getC2PrimaryService(peripheral).then(function(service){
					return getC2GeneralStatusCharacteristic(service);
				})
				.then(function(characteristics) {
					suscribeC2characteristic(characteristics[0],manageBufferPM5C2Erg.unPackageErgEntry31);
					suscribeC2characteristic(characteristics[1],manageBufferPM5C2Erg.unPackageErgEntry32);
					suscribeC2characteristic(characteristics[2],manageBufferPM5C2Erg.unPackageErgEntry33);
					suscribeC2characteristic(characteristics[3],manageBufferPM5C2Erg.unPackageErgEntry35);
					suscribeC2characteristic(characteristics[4],manageBufferPM5C2Erg.unPackageErgEntry36);
					suscribeC2characteristic(characteristics[5],manageBufferPM5C2Erg.unPackageErgEntry3A);
					///////

					/*
					readCharacteristicLoop(characteristics[0],function(data, isNotification){
						console.log(data);
						// manageBufferPM5C2Erg.unPackageErgEntry(data);
					});
					*/
				});
			});
		}	
	}
});

				
				/*
				peripheral.discoverServices([toLongUUID("0030")], function(err, services) {
					services.forEach(function(service) {
						console.log('found service:', service.uuid);

						// C2 rowing general status characteristic 
						
						service.discoverCharacteristics([toLongUUID("0031")], function(err, characteristics) {
							characteristics.forEach(function(characteristic) {
								console.log('\tfound Chracteristic:', characteristic.uuid,characteristic.uuid.substr(4, 4));
								// console.log('\t\tfound service:', characteristic);
							});
						});
					});
					// console.log(services);
				});
				*/
/*
	var promise = new Promise(function (resolve, reject) {
  get('http://www.google.com', function (err, res) {
	if (err) reject(err);
	else resolve(res);
  });
});
*/
	/*
	peripheral.connect(function(err) {
		peripheral.discoverServices([uuidErgService], function(err, services) {
			services.forEach(function(service) {
				ergService = ergService;
				console.log('found service:', service.uuid);
				service.discoverCharacteristics([], function(err, characteristics) {
					characteristics.forEach(function(characteristic) {
						console.log('found characteristic:', characteristic.uuid);
						if (uuidErgCharacteristic == characteristic.uuid) {
							ergCharacteristic = characteristic;
							requestErgData();
						}
					});
				})
			})
		})
	})
	*/

let ergData = {
	spm: undefined,
	distance: undefined,
	power: undefined,
	pace: undefined,
	time: undefined,
}

function emit(ergData){
	console.log("emit",ergData);
}
function suscribeC2characteristic(characteristic,callback){
	characteristic.subscribe(function(error){
		console.log("Suscribe successfully to characteristic ",characteristic.uuid);
	});
	characteristic.on('data', function(data, isNotification) {
		// console.log(data);
		callback(data,ergData);
		// console.log(callback(data));
	});
}

function getC2PrimaryService(peripheral){
	return new Promise(function (resolve, reject) {
		peripheral.discoverServices([toLongUUID("0030")],function(err, services) {
			if (err) 
				reject(err);
			const service = services[0];
			// services.forEach(function(service) {
			console.log('found service:', service.uuid);
			resolve(service);
		});
	});
}

function getC2GeneralStatusCharacteristic(service){
	return getC2Characteristic(service,[
		toLongUUID("0031"),
		toLongUUID("0032"),
		toLongUUID("0033"),
		toLongUUID("0035"),
		toLongUUID("0036"),
		toLongUUID("003A"),
		]);
}
function getC2Characteristic(service,uuids){
	return new Promise(function (resolve, reject) {
		// console.log("service ",service);
		service.discoverCharacteristics(uuids, function(err, characteristics) {
			if (err) 
				reject(err);
			// const characteristic = characteristics[0];

			// characteristics.forEach(function(characteristic) {
			// console.log('\tfound Chracteristic:',characteristic.uuid.substr(4, 4));
			resolve(characteristics);
				// console.log('\t\tfound service:', characteristic);
			// });
		});
	});
}

function readCharacteristicLoop(characteristic,callback){
	// return new Promise(function (resolve, reject) {
	characteristic.read(undefined);
	characteristic.on('read', function(data, isNotification) {
		callback(data, isNotification);
		// var ergData = manageBufferErg.unPackageErgEntry(data);
		// console.log('Erg response 2',data,ergData);
		// socket.emit('ergData',ergData);
		// socket.emit('ergDataBynary',{data:data});
		characteristic.read(undefined);
	});
	// });

}

//ce06003043e511e4916c0800200c9a66
function getErgServices(){
	return ["ce06002043e511e4916c0800200c9a66","ce06001043e511e4916c0800200c9a66","ce06003043e511e4916c0800200c9a66"];
}
function toLongUUID(shortUUID){
	return "ce06"+shortUUID+"43e511e4916c0800200c9a66";
}



function requestErgData() {
	var requestTelemetry = [1,2,3,4];
	var ergData = Buffer.from(requestTelemetry);
	ergCharacteristic.write(ergData, false, function(err) {
		if (!err) {
			console.log('Requesting write');
			ergCharacteristic.read(undefined);
			ergCharacteristic.on('read', function(data, isNotification) {
				var ergData = manageBufferErg.unPackageErgEntry(data);
				console.log('Erg response 2',data,ergData);
				socket.emit('ergData',ergData);
				// socket.emit('ergDataBynary',{data:data});
				ergCharacteristic.read(undefined);
			});
		}
		else {
			console.log('toppings error',err);
		}
	});
}
