'use strict';

const https = require('https');
var googleFinance = require('google-finance');

const baseURL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&interval=15min&outputsize=full&apikey=TJAVUEK5TU2C253U&dataType=json&outputsize=compact';

module.exports = function(app) {

  app.route('/api/carteira').get((req, res) => {
      console.log('Recuperando papeis.....')
        res.send([
            {
                sigla: 'PETR4',
                desc: 'Petrobrás',
                quantidade: 100
            },
            {
                sigla: 'WIZS3',
                desc: 'Wiz',
                quantidade: 100
            },
            {
                sigla: 'MOVI3',
                desc: 'Movida',
                quantidade: 100
            }
        ]);
    });

    app.route('/api/consultar/:papel').get((req, res) => {
        let url = baseURL + '&symbol=' + req.params.papel
        let simb = 'BVMF:' + req.params.papel
        console.log('simbol ' + simb)
        googleFinance.historical({
            symbol: simb,
            from: '2018-01-01',
            to: '2018-01-20'
          }, function (err, quotes) {
              console.log('Quotes : ' + quotes)
            res.send(quotes)
          });

        console.log('URL ' + url)
    })

    app.route('').get((req, res) => {

        https.get(url, (resp) => {
            let data = '';
          
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                console.log(chunk)
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log('Data -> ' + data)
                res.send(data)
 //             console.log(JSON.parse(data).explanation);
            });
          
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });

    })
};
