// // index.js
// import http from 'http';
// import fs from 'fs';
// import path from 'path';
// import app from './server/app.js';

// // Serve static files
// const serveStaticFile = (res, filePath, contentType, responseCode = 200) => {
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('500 - Internal Error');
//     } else {
//       res.writeHead(responseCode, { 'Content-Type': contentType });
//       res.end(data);
//     }
//   });
// };

// const getContentType = (url) => {
//   const ext = path.extname(url);
//   switch (ext) {
//     case '.js':
//       return 'application/javascript';
//     case '.css':
//       return 'text/css';
//     case '.json':
//       return 'application/json';
//     case '.png':
//       return 'image/png';
//     case '.jpg':
//       return 'image/jpeg';
//     default:
//       return 'text/plain';
//   }
// };

// const server = http.createServer((req, res) => {
//   if (req.url.startsWith('/api')) {
//     app(req, res); // Handle API routes with Express app
//   } else if (req.url === '/' && req.method === 'GET') {
//     serveStaticFile(res, path.join(path.dirname(''), 'client/build', 'index.html'), 'text/html');
//   } else if (req.url.startsWith('/static/') && req.method === 'GET') {
//     serveStaticFile(res, path.join(path.dirname(''), 'client/build', req.url), getContentType(req.url));
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('404 - Not Found');
//   }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
