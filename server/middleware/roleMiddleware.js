module.exports = function (allowedRoles) {
  return function (req, res, next) {
      if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).send('Access denied.');
      }
      next();
  };
};