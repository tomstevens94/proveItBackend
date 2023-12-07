import os from 'os';

export const logIpAddress = () => {
  var networkInterfaces = os.networkInterfaces();
  const networkInfo = networkInterfaces['en0'];
  if (!networkInfo || networkInfo.length < 1) return;

  console.log('Local IP address: ', networkInfo[1].address);
};
