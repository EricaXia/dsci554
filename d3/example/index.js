const express = require('express')
const app = express();
const port = 8000;

// server your css as static
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});