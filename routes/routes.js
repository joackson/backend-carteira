'use strict';
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
    })
};
