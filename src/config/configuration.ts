export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  koekVCApiUrl: process.env.VC_API_URL || 'http://localhost:8081',
});
