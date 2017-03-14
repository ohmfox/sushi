const addDevice = (d, devices) => {
  console.log(d, devices);
  const device = devices[d];
  console.log(device);
  noble.stopScanning();
  device.connect(function(error) {
    device.discoverServices([], function(error, services) {
      services.map((service, i) => {
        const serviceInfo = service.uuid;
        service.discoverCharacteristics([], (error, characteristics) => {
          characteristics.map((characteristic, i) => {
            if(characteristic.uuid === 'ffe9') {
              if(data.hex) {
                characteristic.write(new Buffer(`56${data.hex}00f0aa`, 'hex'));
              } else {
                const red = data.red.toString(16);
                const green = data.green.toString(16);
                const blue = data.blue.toString(16);
                characteristic.write(new Buffer(`56${red}${green}${blue}00f0aa`, 'hex'));
              }
              send(res, 200, 'Done!');
            }
          });
        });
      }); 
    });
  });
}

export default addDevice;
