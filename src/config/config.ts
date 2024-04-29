export default () => ({
    port : process.env.PORT,
    jwtSecret : process.env.JWTSCERET,
    host : process.env.HOST
})