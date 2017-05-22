module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'pie',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
