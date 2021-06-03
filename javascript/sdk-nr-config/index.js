const { meter } = require('./tracer');

const app = require('express')();
const https = require('https');

const PORT = process.env.PORT || '8080';

const requestDuration = meter.createValueRecorder('http.server.duration', {
  description: 'Record the duration of incoming requests',
});

app.use(function (_req, res, next) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    requestDuration.record(elapsedTimeInMs);
  });

  next();
});

app.get('/ping', function (_req, res) {
  https
    .get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        res.send(JSON.parse(data).explanation);
      });
    })
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
