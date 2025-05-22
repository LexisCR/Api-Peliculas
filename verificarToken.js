const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = function verificarToken(req, res, next) {
  if (typeof req.headers.authorization === 'undefined') {
    return res.status(401).json({ Error: "Token no enviado" });
  }

  const token = req.headers.authorization.substring(7); // quitar 'Bearer '
  const publica = fs.readFileSync(path.join(__dirname, './Llaves/publica.pem'), 'utf-8');

  jwt.verify(token, publica, { algorithms: ['RS256'] }, function(err, decoded) {
    if (err) {
      return res.status(403).json({ Error: "Acceso denegado" });
    }

    req.user = decoded;
    next();
  });
};
