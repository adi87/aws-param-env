const awsParamStore = require( 'aws-param-store' );

function getName( param ) {

    const nameParts = param.Name.split( '/' );

    return nameParts[ nameParts.length - 1 ];
}

class EnvInitializer {

    constructor( paramPaths, options ) {
        this.paramPaths = paramPaths;
        this.options = options || {};
        this.envNameMap = this.options.envNameMap || {};
    }

    execute( processor = ( parameter ) => parameter ) {

        const { Parameters: parameters } = awsParamStore.getParametersSync(this.paramPaths, this.options);

        const results = {

            added: [],
            ignored: [],
            conflict: []
        };

        for( let param of parameters ) {

            let name = getName( param );

            param = processor( param );

            if( param ) {

                // update
                name = this.envNameMap[param.Name] || getName(param);

                if( !process.env[ name ] ) {

                    process.env[ name ] = param.Value;
                    results.added.push( name );
                }
                else {

                    results.conflict.push( name );
                }
            }
            else {

                results.ignored.push( name );
            }
        }

        return results;
    }
}


module.exports = EnvInitializer;
