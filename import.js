// Requires
var csv = require( 'csv' ),
	mysql = require( 'mysql' ),
	_ = require( 'underscore' );

// Config info
var config = require( 'config' );

// Set up mysql connection
var pool = mysql.createPool({
	host: config.db.host,
	user: config.db.user,
	password: config.db.pass,
	database: config.db.name,
	insecureAuth: true
});

// Empty array for CSV rows
var records = [];

csv().from.path( config.file.base + '/' + config.file.filename, {
	columns: true
}).on( 'record', function ( data ) {
	records.push( data );
}).on( 'end', function () {

	// Now that we have the records, do database things
	pool.getConnection( function ( connerr, connection ) {

		if ( connerr ) throw connerr;

		// Process each record
		_.each( records, function ( v, k ) {
			
			connection.query( "QUERY", [args], function ( error, rows, fields ) {

				if ( error ) throw error;

				
				// Second connection for doing something with each returned row above (if needed)
				/*pool.getConnection( function ( connerr2, connection2 ) {

					_.each( doctors, function ( doc ) {
						connection2.query( "INSERT INTO wp_postmeta ( post_id, meta_key, meta_value ) VALUES ( ?, ?, ? )", [post_id, 'wpcf-practice-doctors', doc], function ( error, rows, fields ) {
							if ( error ) throw error;
							
						});	
					});

					connection2.end();

				});*/							

			});

			// All done at this point, so end it.  END IT.
			if ( ( k + 1 ) == records.length ) {
				connection.end();
				pool.end();
			}

		});

	});

});
