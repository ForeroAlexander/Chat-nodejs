const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const app = express();

app.use(cors());
app.use(express.json());

const clients = new Set();
const messages = [];

const upload = multer({ storage: multer.memoryStorage() });

app.get('/chat/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  messages.forEach(message => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });

  clients.add(res);

  console.log('Nuevo cliente conectado');

  req.on('close', () => {
    clients.delete(res);
    console.log('Cliente desconectado');
  });
});

app.post('/chat/message', (req, res) => {
  const { content, type, sender_id, sender_name } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Mensaje no proporcionado' });
  }

  const messageObject = { type: type || 'text', content, sender_id, sender_name };
  messages.push(messageObject);

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(messageObject)}\n\n`);
  });

  console.log('Mensaje recibido:', messageObject);
  res.status(200).json({ status: 'Mensaje enviado' });
});

app.post('/chat/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Imagen no proporcionada' });
  }

  const processedImage = await sharp(req.file.buffer)
    .resize(800, 800, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  const base64Image = processedImage.toString('base64');
  const messageObject = { type: 'image', content: base64Image };
  messages.push(messageObject);

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(messageObject)}\n\n`);
  });

  console.log('Imagen recibida:', messageObject);
  res.status(200).json({ status: 'Imagen enviada' });
});

app.get('/chat/message/history', (req, res) => {
  res.status(200).json(messages);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});