
var manageBufferPM5C2Erg = function(buf) {
	this.sizeTime = 3;
	this.sizeDistance = 3;
	this.sizeShort = 1;
	if(buf){
		this.buf = buf;
		this.index = 0;
	}else {
		this.buf = Buffer.allocUnsafe(5*4);// Buffer.from([69,69,69]);
		// this.writeHeader();
	}
};

manageBufferPM5C2Erg.prototype.read3Bytes = function(multiplier) {
	var v0 = this.buf.readUInt8(this.index);
	var v1 = this.buf.readUInt8(this.index+1);
	var v2 = this.buf.readUInt8(this.index+2);
	this.index = this.index + 3;
	return (v0 | v1 <<8 |  v2 << 16)*multiplier;
};
manageBufferPM5C2Erg.prototype.read2Bytes = function(multiplier) {
	
	const v = this.buf.readUInt16LE(this.index)*multiplier;
	this.index = this.index + 2;
	return v;
};
/*
manageBufferPM5C2Erg.prototype.read2BytesBE = function(multiplier) {
	this.index = this.index + 2;
	return this.buf.readUInt16BE(this.index)*multiplier;
};*/
manageBufferPM5C2Erg.prototype.readPace = function() {
	return this.read2Bytes(0.01);
};
manageBufferPM5C2Erg.prototype.readTime = function() {
	return this.read3Bytes(0.01);
};

manageBufferPM5C2Erg.prototype.readDistance = function() {
	return this.read3Bytes(0.1);
};

manageBufferPM5C2Erg.prototype.readUnimportantFlags = function(nFlags) {
	this.index = this.index + nFlags;
	return 0;
};
manageBufferPM5C2Erg.prototype.readByte = function() {
	// this.index = this.index + 1;
	return this.buf.readUInt8(this.index++);
};

manageBufferPM5C2Erg.prototype.getBuffer = function() {
	return this.buf;
};
manageBufferPM5C2Erg.prototype.constructor = manageBufferPM5C2Erg;


function unPackageErgEntry31(ergBuffer,ergDataSmart){
	// return 0;

	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	var ergData = {
		time : bufferErg.readTime(),
		distance: bufferErg.readDistance(),
		flags: bufferErg.readUnimportantFlags(5),
		totalWOGDistance: bufferErg.readDistance(),
		totalWOGTime:bufferErg.readTime(),
		WOGTimeType:bufferErg.readByte(),
		drag: bufferErg.readByte(),
	};
	console.log(ergBuffer,ergData);
	ergDataSmart.distance =ergData.distance; 

	return ergData;
}

function unPackageErgEntry32(ergBuffer,ergDataSmart){
	// return 0;
	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	// console.log(ergBuffer);
	var ergData = {
		time : bufferErg.readTime(),
		speed: bufferErg.read2Bytes(0.001),
		spm: bufferErg.readByte(),
		hr: bufferErg.readByte(),
		pace: bufferErg.readPace(),
		
		avgPace: bufferErg.readPace(),
		restDistance: bufferErg.read2Bytes(1),
		restTime:bufferErg.readTime()
	};
	console.log(ergBuffer,ergData);
	ergDataSmart.time =ergData.time; 
	ergDataSmart.spm =ergData.spm; 
	ergDataSmart.pace =ergData.pace; 
	return ergData;
}

function unPackageErgEntry33(ergBuffer){
	// return 0;
	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	// console.log(ergBuffer);
	
	var ergData = {
		time : bufferErg.readTime(),
		interval: bufferErg.readByte(),
		avgPower: bufferErg.read2Bytes(1),
		totalCalories: bufferErg.read2Bytes(1),
		spAvgPace: bufferErg.readPace(),
		spAvgPower: bufferErg.read2Bytes(1),
		spAvgCalories: bufferErg.read2Bytes(1),
		spAvgTime: bufferErg.read3Bytes(0.1),
		spAvgDistance: bufferErg.readDistance(),
	};
	console.log(ergBuffer,ergData);

	return ergData;
}

function unPackageErgEntry35(ergBuffer){
	// return 0;
	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	// console.log(ergBuffer);
	var ergData = {
		time : bufferErg.readTime(),
		distance: bufferErg.readDistance(),
		driveLength: bufferErg.readByte()*0.01,
		driveTime: bufferErg.readByte()*0.01,
		strokeRecoveryTime: bufferErg.read2Bytes(0.01),
		strokeRecoveryDistance: bufferErg.read2Bytes(0.01),
		peakDriveForce:bufferErg.read2Bytes(0.1),
		avgDriveForce:bufferErg.read2Bytes(0.1),
		strokeCount:bufferErg.read2Bytes(1)
	};
	console.log(ergBuffer,ergData);
	return ergData;
}

function unPackageErgEntry36(ergBuffer){
	// return 0;
	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	// console.log(ergBuffer);
	var ergData = {
		time : bufferErg.readTime(),
		strokePower: bufferErg.read2Bytes(1),
		strokeCalories: bufferErg.read2Bytes(1),
		strokeCount: bufferErg.read2Bytes(1)
	};
	console.log(ergBuffer,ergData);
	return ergData;
}

function unPackageErgEntry3A(ergBuffer){
	// return 0;
	var bufferErg = new manageBufferPM5C2Erg(ergBuffer); //Object.create(ManageBuffer.prototype);
	console.log(ergBuffer);
	var ergData = {
		garbage : bufferErg.readUnimportantFlags(8),
		calories: bufferErg.read2Bytes(1),
		power: bufferErg.read2Bytes(1),
		// strokeCount: bufferErg.read2Bytes(1)
	};
	console.log(ergBuffer,ergData);
	return ergData;
}

module.exports = {
	manageBufferPM5C2Erg:manageBufferPM5C2Erg,
	// packageErgEntry:packageErgEntry,
	unPackageErgEntry31:unPackageErgEntry31,
	unPackageErgEntry32:unPackageErgEntry32,
	unPackageErgEntry33:unPackageErgEntry33,
	unPackageErgEntry35:unPackageErgEntry35,
	unPackageErgEntry36:unPackageErgEntry36,
	unPackageErgEntry3A:unPackageErgEntry3A,
};
