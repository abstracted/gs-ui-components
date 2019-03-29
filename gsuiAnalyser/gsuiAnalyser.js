"use strict";

class gsuiAnalyser {
	setCanvas( canvas ) {
		this.rootElement = canvas;
		this._ctx = canvas.getContext( "2d" );
		this._scaleToData = true;
	}
	clear() {
		this._ctx.clearRect( 0, 0, this.rootElement.width, this.rootElement.height );
	}
	setResolution( w, h ) {
		const cnv = this.rootElement,
			img = this._ctx.getImageData( 0, 0, cnv.width, cnv.height );

		cnv.width = Math.max( w, 2 );
		cnv.height = Math.max( h, 2 );
		this._ctx.putImageData( img, 0, 0 );
	}
	scaleToData( b ) {
		this._scaleToData = b;
	}
	draw( ldata, rdata ) {
		const w = ldata.length * 2;

		this._moveImage();
		if ( this._scaleToData && w !== this.rootElement.width ) {
			this.rootElement.width = w;
		}
		this._draw( ldata, rdata );
	}

	// private:
	_moveImage() {
		const cnv = this.rootElement,
			img = this._ctx.getImageData( 0, 0, cnv.width, cnv.height - 1 );

		this._ctx.putImageData( img, 0, 1 );
	}
	_draw( ldata, rdata ) {
		const ctx = this._ctx,
			w2 = ctx.canvas.width / 2,
			len = Math.min( w2, ldata.length ),
			imgL = gsuiSpectrum.draw( ctx, ldata ),
			imgR = gsuiSpectrum.draw( ctx, rdata ),
			imgLflip = ctx.createImageData( len, 1 );

		for ( let x = 0, x2 = len - 1; x < len; ++x, --x2 ) {
			imgLflip.data[ x * 4     ] = imgL.data[ x2 * 4     ];
			imgLflip.data[ x * 4 + 1 ] = imgL.data[ x2 * 4 + 1 ];
			imgLflip.data[ x * 4 + 2 ] = imgL.data[ x2 * 4 + 2 ];
			imgLflip.data[ x * 4 + 3 ] = imgL.data[ x2 * 4 + 3 ];
		}
		ctx.putImageData( imgLflip, 0, 0 );
		ctx.putImageData( imgR, w2, 0 );
	}
}
