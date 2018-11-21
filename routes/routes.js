'use strict';
module.exports = function(app) {

  app.route('/api/carteira').get((req, res) => {
      console.log('Recuperando papeis.....')
        res.send([
            {
                sigla: 'PETR4',
                desc: 'Petrobrás',
                quantidade: 100
            }
        ]);
    })
};
