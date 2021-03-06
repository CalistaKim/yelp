import ReactDOM from 'react-dom'
import React, { PropTypes as T } from 'react'
import { Marker } from 'google-maps-react'

export class GoogleMap extends React.Component {
  _renderChildren() {
    const {children} = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.props.center,
        places: this.props.places
      });
    })
    
  }

  componentWillReceiveProps(newprops){

    if (newprops.center !== this.props.center ){
      // console.log('GoogleMap got newprops: ',newprops.center)
      this.loadMap(newprops);
    } 
  }

  componentDidMount(newprops) {
    // console.log('GoogleMap component mounting')
    this.loadMap();
  }

  loadMap(newprops=null) {
    console.log('GoogleMap loading')
    if (this.props && this.props.google) {
      const {google} = this.props;
      const maps = google.maps;
      const mapRef = this.refs.googlemap;
      const node = ReactDOM.findDOMNode(mapRef);
      var {center, zoom} = this.props;
      var {lat, lng} = center;

      if (newprops){
        center = newprops.center;
        zoom = newprops.zoom;
        var {lat, lng} = center;
      }

      const coords = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign({}, {
        center: coords,
        zoom: zoom,
        mapTypeControl:false,
      })

      this.map = new maps.Map(node, mapConfig);


      this.map.addListener('ready', (evt) => {
        this.props.onReady(google, this.map)
      })

      maps.event.trigger(this.map, 'ready'); 
    


    }
  }

  render() {
    return (
      <div ref='googlemap'>
        Loading map...
        {this._renderChildren()}
      </div>
    )
  }
}

Map.propTypes = {
  google:T.object,
  zoom:T.number,
  initialCenter:T.object,
  onReady: React.PropTypes.func
}

Map.defaultProps = {
  zoom: 13,
  // San Francisco, by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  mapTypeControl:false,
  onReady: function() {console.log('default prop fired')}
}

export default GoogleMap