module.exports = {
  url: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/default?authSource=admin`
};
