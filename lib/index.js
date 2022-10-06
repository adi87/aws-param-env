const EnvInitializer = require( './env' );

function initializer( paths, options ) {

    return new EnvInitializer( paths, options );
}

function load( paths, options ) {

    // use max size of 10 and chunk it into that
    const chunkSize = 10;
    for(let i = 0; i < paths.length; i += chunkSize) {
        const chunk = paths.slice(i, i + chunkSize);
        initializer(chunk, options).execute();
    }
}

if( process.env.AWS_SSM_ENV_PATH && process.env.AWS_REGION ) {

    // load from supplied path
    load( process.env.AWS_SSM_ENV_PATH );
}

module.exports = {

    initializer,
    load,
};
