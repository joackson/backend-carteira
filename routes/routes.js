'use strict';

const https = require('https');
var googleFinance = require('google-finance');
var yahooFinance = require('yahoo-finance');
var formatNumber = require('simple-format-number');
var dateFormat = require('dateformat');

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
            symbol: 'PETR4.SA',
            from: '2019-01-01',
            to: '2019-01-20'
          }, function (err, quotes) {
              console.log('Quotes : ' + quotes)
            res.send(quotes)
          });

          yahooFinance.historical({
            symbols: ['PETR4.SA', 'VALE3.SA'],
            from: '2019-03-01',
            to: '2019-03-01'
          }, function (err, quotes) {
              if(err) {
                  console.log(err)
              }else {
                console.log( quotes)
                res.send(quotes)
              }
            
          });
          

        //console.log('URL ' + url)
    })

    app.route('/api/consultar/csv/:papel').get((req, res) => {
        let simb = req.params.papel.split('+')
        console.log('simbol ' + simb)
        var day=dateFormat(new Date(), "yyyy-mm-dd");
        console.log(day)
          yahooFinance.historical({
            symbols: simb,
            from: '2019-03-01',
            to: '2019-03-01'
          }, function (err, quotes) {
              if(err) {
                  console.log(err)
              }else {

                console.log( quotes)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/csv');
                let fields = ['close', 'adjClose', 'open', 'high', 'low', 'volume']
                simb.forEach(function(item) {
                    let data = []
                    let g1 = quotes[item].map(function(field) {
                        console.log(field)
                        fields.map(function(fieldName) {
                            data.push(formatNumber(field[fieldName], {fractionDigits : 2}))
                        })
                        return JSON.stringify(data).replace(/\[|\]|\"/g, '');

                    }) + '\r\n';
                    console.log(g1)
                    res.write(g1)
                  });
                
                res.end()
              }
            
          });
          

        //console.log('URL ' + url)
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
