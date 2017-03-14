import noble from 'noble';

import { pazaak } from '../pazaak';

function bluetoothState() {
  return pazaak(observer => {
    noble.on('stateChange', (state) => { observer.next(state); });
    return () => {};
  });
}

bluetoothState().subscribe({
  next(state) {
    if(state === 'poweredOn') {
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
  }
});

const explore = (device) => {
  device.on('disconnect', function() {
    process.exit(0);
  });
}

function devices() {
  return pazaak((observer) => {
    noble.on('discover', (peripheral) => {
      observer.next(peripheral);
    });
		setTimeout(() => { observer.complete() }, 10000);
    return () => {};
  })
}

export default {
  bluetoothState,
    devices
};
