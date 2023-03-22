// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort } = require('serialport')
const tableify = require('tableify')
const usb = require('usb')
const { getDeviceList, WebUSBDevice } = require('usb');

usb.useUsbDkBackend()
async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML
  })
}

const usbs = () =>{
  const devices = getDeviceList()
    document.getElementById('devices').innerHTML = tableify(devices);
}

const readUsb = async() => {
const VENDORD_ID = 2316;
const DEVICE_ID = 4096;

const device = usb.findByIds(VENDORD_ID, DEVICE_ID)
console.log(device)

 device.open();
console.log('DEVICE OPENED')

const endpoint = device.interface(0).endpoints[1];
console.log('ENDPOINT', endpoint)
endpoint.startPoll()

endpoint.on('data', (data) => {
  console.log(data.toString())
})

process.on('SIGINT', async() => {
  endpoint.stopPoll()
  device.close();
})
}


async function listPorts() {
 await listSerialPorts();
 usbs();
  setTimeout(listPorts, 2000);
  setTimeout(usbs, 2000);
}


// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 2000);
setTimeout(usbs, 2000); 

listSerialPorts()
usbs();
readUsb()