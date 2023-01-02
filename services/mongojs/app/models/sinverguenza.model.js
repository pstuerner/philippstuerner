module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        timestamp: String,
        listings: Array,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const myDB = mongoose.connection.useDb('sinverguenza')
    const Timeseries = myDB.model("timeseries", schema);
    return Timeseries;
  };
  