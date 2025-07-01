module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const projectSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    nickName: { type: String },
    picture: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
    provider: { type: String },
    oauthID: { type: String },
    role: { type: String, default: 'normal' },
  }, {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
      },
    },
  });
  return mongoose.model('user', projectSchema);
};
