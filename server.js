const express = require('express')
const rp = require('request-promise')
const jsonfile = require('jsonfile')
const path = require('path')
const port = 3000

const cityListFile = './city_list.json';

let indexJsonData = [];

function PrepareCitiesData() {

  jsonfile.readFile(cityListFile, function(err, jsonData) {
    function ChunkIndexJsonData() {
      let letter,
          cities = []

      this.letter = function(l) {
        if (!arguments.length) return letter;
        letter = l;
      };

      this.cities = function(c) {
        if (!arguments.length) return cities;
        cities.push(c);
      };
    }

    let chunkIndexJsonData = new ChunkIndexJsonData();

    for (j=0; j<jsonData.length; j++) {

      if (!chunkIndexJsonData.letter()) {
        chunkIndexJsonData.letter( jsonData[j].name.charAt(0) )
        chunkIndexJsonData.cities( jsonData[j] )
        indexJsonData.push(chunkIndexJsonData)
      }

      if (jsonData[j].name.charAt(0) === chunkIndexJsonData.letter() ) {
        chunkIndexJsonData.cities( jsonData[j] )
      } else {
        chunkIndexJsonData = new ChunkIndexJsonData();
        indexJsonData.push(chunkIndexJsonData)
        chunkIndexJsonData.letter( jsonData[j].name.charAt(0) )
        chunkIndexJsonData.cities( jsonData[j] )
      }
    }
    return indexJsonData
  });
}

const app = express();
const indexPath = path.join(__dirname, '/index.html');
const publicPath = express.static(path.join(__dirname, '/dist'));

app.use('/dist', publicPath);
app.get('/', function (_, res) { res.sendFile(indexPath) });


app.get('/weather/:city_id', (req, res) => {
  rp({
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      id: req.params.city_id,
      appid: 'c7213d362fa5c1b55ba420e650a5a9ef'
    },
    json: true
  })
    .then((data) => {
      res.setHeader('Content-Type', 'application/json');
      res.send( data );
    })
    .catch((err) => {
      console.log(err)
    })
});

app.get('/cities/:literal', (req, res) => {
    let literal = req.params.literal.toUpperCase()
    for (i=0; i<indexJsonData.length; i++) {
        if (literal === indexJsonData[i].letter() ) {
          res.setHeader('Content-Type', 'application/json');
          res.send( JSON.stringify(indexJsonData[i].cities()) );
        }
    }
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  PrepareCitiesData()
});
