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
        let simb = 'B3:' + req.params.papel
        console.log('simbol ' + simb)
        googleFinance.historical({
            symbol: 'IBOV:PETR4.SA',
            from: '2019-01-01',
            to: '2019-01-20'
          }, function (err, quotes) {
              console.log('Quotes : ' + quotes)
//            res.send(quotes)
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
        /*
          yahooFinance.historical({
            symbols: simb,
            from: day,
            to: day
          }, function (err, quotes) {
              if(err) {
                  console.log(err)
              }else {

                console.log( quotes)

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=cotacao-' + day + '.csv')
                let fields = ['close', 'adjClose', 'open', 'symbol', 'date', 'volume', 'low', 'high']
                simb.forEach(function(item) {
                    let data = []
                    let g1 = quotes[item].map(function(field) {
                        console.log(field)
                        fields.map(function(fieldName) {
                            if (fieldName != 'volume' && fieldName != 'date' && fieldName != 'symbol') {
                                data.push(formatNumber(field[fieldName], {fractionDigits : 2}))
                            }else if (fieldName == 'date') {
                                console.log(dateFormat(field[fieldName], "yyyy-mm-dd HH:MM:ss"))
                                data.push(dateFormat(field[fieldName], "yyyy-mm-dd HH:mm:ss"))
                            }else {
                                data.push(field[fieldName])
                            }
                        })
                        return JSON.stringify(data).replace(/\[|\]|\"/g, '');

                    }) + '\r\n';
                    console.log(g1)
                    res.write(g1)
                  });
                
                res.end()
              }
            
          });
*/
          let newFields = ['regularMarketPrice', 'regularMarketPreviousClose', 'regularMarketOpen', 'shortName', 'regularMarketTime', 'regularMarketVolume', 'regularMarketDayLow', 'regularMarketDayHigh']
          yahooFinance.quote({
            symbols: simb
          }, function (err, quotes) {
              if(err) {
                  console.log(err)
                  res.end()
              }else {
//                console.log( quotes)
                simb.forEach(function(item) {
                    let data = []
                    console.log('itens de : ' + item)
                    console.log(quotes[item].price)
                    let price = quotes[item].price
                    newFields.map(function(fieldName) {
                            if (fieldName != 'regularMarketVolume' && fieldName != 'regularMarketTime' && fieldName != 'shortName') {
                                data.push(formatNumber(price[fieldName], {fractionDigits : 2}))
                            }else if (fieldName == 'regularMarketTime') {
                                data.push(dateFormat(price[fieldName], "yyyy-mm-dd HH:mm:ss"))
                            }else {
                                data.push(price[fieldName])
                            }
                        })
                    res.write(JSON.stringify(data).replace(/\[|\]|\"/g, '') + '\r\n')
                  });
                res.end()
              }
            
          });

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
