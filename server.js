import http from 'http';
import express from 'express';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'dist', 'views'));
app.set('view engine', 'ejs');
app.use(serveStatic(join(__dirname, 'dist', 'public')));

const homepage = (req, res) => {
  res.render('index', {});
};

app.get('/', homepage);

server.listen(app.get('port'), () => {
  console.log('Genghis Khan game is listening on port ' + app.get('port'));
});
