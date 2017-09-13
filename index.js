/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

//Library PanomNom
!function(){function e(e,t){for(var o=e.split("&"),i=0;i<o.length;i++){var s=o[i].split("=");if(decodeURIComponent(s[0])==t)return decodeURIComponent(s[1])}}var t=function(){};t.prototype={constructor:t,apply:function(e){e.addEventListener=t.prototype.addEventListener,e.hasEventListener=t.prototype.hasEventListener,e.removeEventListener=t.prototype.removeEventListener,e.dispatchEvent=t.prototype.dispatchEvent},addEventListener:function(e,t){void 0===this._listeners&&(this._listeners={});var o=this._listeners;void 0===o[e]&&(o[e]=[]),o[e].indexOf(t)===-1&&o[e].push(t)},hasEventListener:function(e,t){if(void 0===this._listeners)return!1;var o=this._listeners;return void 0!==o[e]&&o[e].indexOf(t)!==-1},removeEventListener:function(e,t){if(void 0!==this._listeners){var o=this._listeners,i=o[e];if(void 0!==i){var s=i.indexOf(t);s!==-1&&i.splice(s,1)}}},dispatchEvent:function(e){if(void 0!==this._listeners){var t=this._listeners,o=t[e.type];if(void 0!==o){e.target=this;for(var i=[],s=o.length,r=0;r<s;r++)i[r]=o[r];for(var r=0;r<s;r++)i[r].call(this,e)}}}};var o={};o.GOOGLEMAPSAPI="http://maps.google.com/maps/api/js?sensor=false",o.GoogleStreetViewService=null,o.GoogleGeoCoder=null,o.Utils={loadAsync:function(e,t){var o=document.createElement("script");o.type="text/javascript",o.src=e;var i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(o,i),o.addEventListener("load",t)},getGoogleStreetViewService:function(){return o.GoogleStreetViewService?o.GoogleStreetViewService:(o.GoogleStreetViewService=new google.maps.StreetViewService,o.GoogleStreetViewService)},getGoogleGeoCoder:function(){return o.GoogleGeoCoder?o.GoogleGeoCoder:(o.GoogleGeoCoder=new google.maps.Geocoder,o.GoogleGeoCoder)},resolveAddress:function(e,t){var o=this.getGoogleGeoCoder();o.geocode({address:e},function(e,o){o==google.maps.GeocoderStatus.OK&&t(e[0].geometry.location)})}},o.Stitcher=function(e){this.canvas=e,this.ctx=this.canvas.getContext("2d"),this.queue=[],this.toLoad=0,this.loaded=0},o.Stitcher.prototype.reset=function(){this.toLoad=0,this.loaded=0},o.Stitcher.prototype.addTileTask=function(e){this.queue.push(e),this.toLoad++},o.Stitcher.prototype.updateProgress=function(){var e=100*this.loaded/this.toLoad;this.dispatchEvent({type:"progress",message:e})},o.Stitcher.prototype.processQueue=function(){if(this.updateProgress(),0===this.queue.length)return void this.dispatchEvent({type:"finished"});var e=this.queue.shift(),t=new Image;t.addEventListener("load",function(){this.loaded++,this.ctx.drawImage(t,0,0,t.naturalWidth,t.naturalHeight,e.x,e.y,512,512),this.processQueue(),t=null}.bind(this)),t.addEventListener("error",function(){this.dispatchEvent({type:"error",message:"images missing"}),this.processQueue(),t=null}.bind(this)),t.crossOrigin="",t.src=e.url},t.prototype.apply(o.Stitcher.prototype),o.Loader=function(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.stitcher=new o.Stitcher(this.canvas),this.stitcher.addEventListener("finished",function(){this.dispatchEvent({type:"load",message:"Panorama loaded"})}.bind(this)),this.stitcher.addEventListener("progress",function(e){this.dispatchEvent({type:"progress",message:e.message})}.bind(this))},o.Loader.prototype.load=function(){},o.Loader.prototype.error=function(e){this.dispatchEvent({type:"error",message:e})},t.prototype.apply(o.Loader.prototype),o.GoogleStreetViewLoader=function(){o.Loader.call(this),this.service=o.Utils.getGoogleStreetViewService(),this.levelsW=[1,2,4,7,13,26],this.levelsH=[1,1,2,4,7,13],this.tileSize=416,this.widths=[416,832,1664,3328,6656,13312],this.heights=[416,416,832,1664,3328,6656],this.zoom=1,this.metadata={}},o.GoogleStreetViewLoader.prototype=Object.create(o.Loader.prototype),o.GoogleStreetViewLoader.prototype.load=function(e,t){void 0===t&&(t=1),this.zoom=t,this.panoId=e,this.canvas.width=this.widths[t],this.canvas.height=this.heights[t];for(var o=this.levelsW[t],i=this.levelsH[t],s=0;s<i;s++)for(var r=0;r<o;r++){var n="https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid="+e+"&output=tile&x="+r+"&y="+s+"&zoom="+t+"&nbt&fover=2";this.stitcher.addTileTask({url:n,x:512*r,y:512*s})}n="http://maps.google.com/cbk?output=json&hl=x-local&cb_client=maps_sv&v=4&dm=1&pm=1&ph=1&hl=en&panoid="+e,this.service.getPanoramaById(e,function(e,t){return null===e?void this.error("Can't load panorama information"):(this.metadata=e,this.dispatchEvent({type:"data",message:e}),void this.stitcher.processQueue())}.bind(this))},o.GoogleStreetViewLoader.prototype.loadFromLocation=function(e,t){this.getIdByLocation(e,function(e){this.load(e,t)}.bind(this))},o.GoogleStreetViewLoader.prototype.loadFromURL=function(t,o){if(t.indexOf("panoid")!=-1){var i=e(t,"panoid");this.load(i,2)}else if(t.indexOf("!1s")!=-1){var s=t.indexOf("!1s")+3,r=t.substr(s).indexOf("!"),i=t.substr(s,r);this.load(i,o)}else this.dispatchEvent({type:"error",message:"can't find panorama id in specified URL"})},o.GoogleStreetViewLoader.prototype.getIdByLocation=function(e,t){var o="https://cbks0.google.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=polygon&it=1%3A1&rank=closest&ll="+e.lat()+","+e.lng()+"&radius=50",i=new XMLHttpRequest;i.open("GET",o,!0),i.onreadystatechange=function(){if(4==i.readyState&&200==i.status){var e=JSON.parse(i.responseText);e&&e.result&&0!==e.result.length?t(e.result[0].id):this.error("No panoramas around location")}}.bind(this),i.send(null)};o.GoogleStreetViewLoader.prototype.extractDepthData=function(e){for(var t=e;t.length%4!=0;)t+="=";t=t.replace(/-/g,"+"),t=t.replace(/_/g,"/"),document.body.textContent=t;var o=zpipe.inflate($.base64.decode(t)),s=new Uint8Array(o.length);for(i=0;i<o.length;++i)s[i]=o.charCodeAt(i)},o.GooglePhotoSphereLoader=function(){o.Loader.call(this),this.service=o.Utils.getGoogleStreetViewService()},o.GooglePhotoSphereLoader.prototype=Object.create(o.Loader.prototype),o.GooglePhotoSphereLoader.prototype.loadFromURL=function(e,t){if(e.indexOf("!1s")!=-1){var o=e.indexOf("!1s")+3,i=e.substr(o).indexOf("!"),s=e.substr(o,i);this.load(s,t)}},o.GooglePhotoSphereLoader.prototype.load=function(e,t){this.zoom=t,this.panoId=e,this.service.getPanoramaById(e,function(o,i){if(null===o)return void this.error("Can't load panorama information");var s=Math.floor(Math.log(o.tiles.worldSize.width/o.tiles.tileSize.width)/Math.log(2));this.canvas.width=o.tiles.worldSize.width*Math.pow(2,t-1)/Math.pow(2,s),this.canvas.height=o.tiles.worldSize.height*Math.pow(2,t-1)/Math.pow(2,s);for(var r=this.canvas.width/o.tiles.tileSize.width,n=this.canvas.height/o.tiles.tileSize.height,a=0;a<n;a++)for(var h=0;h<r;h++){var d="https://geo1.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&panoid="+e+"&output=tile&x="+h+"&y="+a+"&zoom="+t+"&nbt&fover=2";this.stitcher.addTileTask({url:d,x:h*o.tiles.tileSize.width,y:a*o.tiles.tileSize.height})}this.stitcher.processQueue()}.bind(this))},window.PANOMNOM=o}();

window.onGoogleMapAPILoaded = function(){
  document.querySelectorAll("[streetview]").forEach(function(entity){
    entity.components["streetview"].loadPano();
  })
}

let apiScript = document.createElement("script");
apiScript.src = "https://maps.google.com/maps/api/js?";
apiScript.src += "key="+"AIzaSyDlXjRBMzVECLoqVIPCZyOT2Pl89QawvUw";
apiScript.src += "&callback=onGoogleMapAPILoaded";
document.querySelector("head").appendChild(apiScript);

/**
* 360 Street View component for A-Frame.
*/
AFRAME.registerComponent('streetview', {
  schema:{
    location : {type: "string", default:"40.730031, -73.991428"},
    radius : {type: "number", default: 100}
  },
  init: function () {
  },
  loadPano: function(){
    var that = this;

    let l = new PANOMNOM.GoogleStreetViewLoader();

    l.addEventListener( 'load', function() {
      let sphereElt = undefined;
      if(that.el.object3D.children.length && that.el.object3D.children[0].geometry.metadata.type === "SphereGeometry"){
        sphereElt = that.el;
      }
      else{
        sphereElt = document.createElement("a-sphere");
        sphereElt.setAttribute("radius", that.data.radius);
        that.el.appendChild(sphereElt);
      }
      sphereElt.setAttribute("material", {src :this.canvas.toDataURL(), side: "double"});
    } );

    l.addEventListener( 'error', function( e ) {
      console.log( e.message );
    } );

    l.addEventListener( 'progress', function( e ) {
      console.log( 'Loaded ' + ( e.message ).toFixed( 0 ) + '%' )
    } );

    let myLatlng = new google.maps.LatLng( that.data.location.split(",")[0], that.data.location.split(",")[1] );
    l.loadFromLocation( myLatlng, 3 );
  }
});
