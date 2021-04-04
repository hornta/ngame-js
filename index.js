const fetch = require('node-fetch');
const zlib = require('zlib');

const bucketUrl = 'http://bucket.thewayoftheninja.org';
const levelUrl = bucketUrl + '/350506.txt';

(async () => {
  const response = await fetch(levelUrl);
  const arrayBuffer = await response.text();
  const decoded = Buffer.from(arrayBuffer, 'base64');
  const inflated = zlib.inflateSync(decoded);
  const length = inflated.readUInt16BE(0);
  console.log(inflated.toString('utf8', 2, 2 + length));
  console.log(inflated);
})();
