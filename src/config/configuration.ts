export default () => {
  return {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/broadcast'
  };
};
