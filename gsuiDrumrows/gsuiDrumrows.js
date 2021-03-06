"use strict";

class gsuiDrumrows {
	constructor() {
		const root = gsuiDrumrows.template.cloneNode( true ),
			reorder = new gsuiReorder();

		this.rootElement = root;
		this.onchange = () => {};
		this._rows = new Map();
		this._lines = new Map();
		this._reorder = reorder;
		this._dragoverId =
		this._elDragover =
		this._elLinesParent = null;
		Object.seal( this );

		root.ondrop = this._ondropRows.bind( this );
		root.onclick = this._onclickRows.bind( this );
		root.ondragover = this._ondragoverRows.bind( this );
		root.ondragleave = this._ondragleaveRows.bind( this );
		root.oncontextmenu = this._oncontextmenuRows.bind( this );
		reorder.onchange = this._onreorderRows.bind( this );
		reorder.setRootElement( root );
		reorder.setSelectors( {
			item: ".gsuiDrumrows .gsuiDrumrow",
			handle: ".gsuiDrumrows .gsuiDrumrow-grip",
			parent: ".gsuiDrumrows",
		} );
	}

	// .........................................................................
	setLinesParent( el, childClass ) {
		this._elLinesParent = el;
		this._reorder.setShadowElement( el );
		this._reorder.setShadowChildClass( childClass );
	}
	setFontSize( fs ) {
		this.rootElement.style.fontSize =
		this._elLinesParent.style.fontSize = `${ fs }px`;
	}
	reorderDrumrows( obj ) {
		gsuiReorder.listReorder( this.rootElement, obj );
		gsuiReorder.listReorder( this._elLinesParent, obj );
	}

	// .........................................................................
	add( id, elLine ) {
		const elRow = gsuiDrumrows.templateRow.cloneNode( true );

		elRow.dataset.id =
		elLine.dataset.id = id;
		this._rows.set( id, elRow );
		this._lines.set( id, elLine );
		this.rootElement.append( elRow );
		this._elLinesParent.append( elLine );
	}
	remove( id ) {
		this._rows.get( id ).remove();
		this._lines.get( id ).remove();
		this._rows.delete( id );
		this._lines.delete( id );
	}
	change( id, prop, val ) {
		switch ( prop ) {
			case "name": this._changeName( id, val ); break;
			case "order": this._changeOrder( id, val ); break;
			case "toggle": this._changeToggle( id, val ); break;
		}
	}
	_changeName( id, name ) {
		this._rows.get( id ).querySelector( ".gsuiDrumrow-name" ).textContent = name;
	}
	_changeToggle( id, b ) {
		this._rows.get( id ).classList.toggle( "gsuiDrumrow-mute", !b );
		this._lines.get( id ).classList.toggle( "gsuiDrumrow-mute", !b );
	}
	_changeOrder( id, order ) {
		this._rows.get( id ).dataset.order =
		this._lines.get( id ).dataset.order = order;
	}

	// .........................................................................
	static _isDrumrow( el ) {
		return (
			el.classList.contains( "gsuiDrumrow" ) ? el :
			el.classList.contains( "gsuiDrumrows-drop" ) ||
			el.classList.contains( "gsuiDrumrow-grip" ) ||
			el.classList.contains( "gsuiDrumrow-toggle" ) ||
			el.classList.contains( "gsuiDrumrow-delete" ) ? el.parentNode : null
		);
	}

	// events:
	// .........................................................................
	_onreorderRows( elRow ) {
		const rows = gsuiReorder.listComputeOrderChange( this.rootElement, {} );

		this.onchange( "reorderDrumrow", elRow.dataset.id, rows );
	}
	_onclickRows( e ) {
		const { classList, parentNode } = e.target;

		if ( classList.contains( "gsuiDrumrow-toggle" ) ) {
			this.onchange( "toggleDrumrow", parentNode.dataset.id );
		}
		if ( classList.contains( "gsuiDrumrow-delete" ) ) {
			this.onchange( "removeDrumrow", parentNode.dataset.id );
		}
	}
	_oncontextmenuRows( e ) {
		const { classList, parentNode } = e.target;

		e.preventDefault();
		if ( classList.contains( "gsuiDrumrow-toggle" ) ) {
			this.onchange( "toggleOnlyDrumrow", parentNode.dataset.id );
		}
	}
	_ondropRows( e ) {
		if ( this._dragoverId ) {
			const [ patId ] = e.dataTransfer.getData( "text" ).split( ":" );

			if ( patId ) {
				this._dragoverId === Infinity
					? this.onchange( "addDrumrow", patId )
					: this.onchange( "changeDrumrowPattern", this._dragoverId, patId );
			}
		}
		this._ondragleaveRows();
	}
	_ondragleaveRows() {
		if ( this._elDragover ) {
			this._elDragover.classList.remove( "gsuiDrumrows-dragover" );
			this._elDragover =
			this._dragoverId = null;
		}
	}
	_ondragoverRows( e ) {
		const tar = e.target,
			isParent = tar.classList.contains( "gsuiDrumrows" ),
			elDragover = isParent
				? tar
				: gsuiDrumrows._isDrumrow( tar );

		if ( elDragover !== this._elDragover ) {
			this._dragoverId = null;
			if ( isParent ) {
				this._dragoverId = Infinity;
			} else if ( elDragover ) {
				this._dragoverId = elDragover.dataset.id;
			}
			if ( this._elDragover ) {
				this._elDragover.classList.remove( "gsuiDrumrows-dragover" );
			}
			this._elDragover = elDragover;
			if ( elDragover ) {
				elDragover.classList.add( "gsuiDrumrows-dragover" );
			}
		}
	}
}

gsuiDrumrows.template = document.querySelector( "#gsuiDrumrows-template" );
gsuiDrumrows.template.remove();
gsuiDrumrows.template.removeAttribute( "id" );

gsuiDrumrows.templateRow = document.querySelector( "#gsuiDrumrow-template" );
gsuiDrumrows.templateRow.remove();
gsuiDrumrows.templateRow.removeAttribute( "id" );

Object.freeze( gsuiDrumrows );
