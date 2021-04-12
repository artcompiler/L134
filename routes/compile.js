module.exports = (compiler) => {
  return (req, res) => {
    const t0 = new Date;
    let body = req.body;
    let code = body.code || body.src;
    let data = body.data;
    let config = body.config || {};
    if (!code || !data) {
      return res.sendStatus(400);
    }
    console.log("compile() data=" + JSON.stringify(data));
    compiler.compile(code, data, config, function (err, val) {
      if (err && err.length) {
        res.status(500).json({error: err});
        return;
      }
      console.log("POST /compile in " + (new Date() - t0) + "ms");
      res.status(200).json(val);
    });
  };
};
