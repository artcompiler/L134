module.exports = (compiler) => {
  return (req, res) => {
    const langID = compiler.langID;
    if (req.params.path) {
      console.log("/lang __dirname=" + __dirname + " path=" + req.params.path);
      res.sendFile(__dirname + "/../pub/" + req.params.path);
    } else {
      res.send(`Hello, L${langID}!`);
    }
  };
};
