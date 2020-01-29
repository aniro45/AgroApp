module.exports = fn => {
  return (Request, Response, next) => {
    fn(Request, Response, next).catch(next);
  };
};
