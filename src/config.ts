// rename to config.ts before build

const { SERVER_HOST, SERVER_PORT } = process.env


if ( SERVER_PORT === undefined || SERVER_HOST === undefined) {
    console.log('No ENV')
    process.exit(1)
}


export default {
    app: {
        host: SERVER_HOST,
        port: SERVER_PORT
    }
}