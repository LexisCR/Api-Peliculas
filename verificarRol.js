module.exports = function verificarRol(rolPermitido) {
  return function (req, res, next) {
    if (!req.user || req.user.rol !== rolPermitido) {
      return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};