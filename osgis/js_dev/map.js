/*
// Copyright 2014 in medias res Gesellschaft fuer Informationstechnologie mbH
// The ddb project licenses this file to you under the Apache License,
// version 2.0 (the "License"); you may not use this file except in compliance
// with the License. You may obtain a copy of the License at:
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
*/

function initialize_map() {
    OSGIS.geographic = new OpenLayers.Projection("EPSG:4326");
    OSGIS.mercator = new OpenLayers.Projection("EPSG:900913");
    OSGIS.bounds = new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34);
    OSGIS.initial_bounds = new OpenLayers.Bounds(6153486.5242131,	314309.06026487, 1984916.7502331, 6954546.5805303)
    OSGIS.center = new OpenLayers.LonLat( 1007440.0326582, 6473299.05)
    OSGIS.nominatimController = new NominatimController({
        object_name : "nominatimController",
        div:"nominatim_controller",
        result_div: "nominatim_result_list"
    })
    window.nominatimController = OSGIS.nominatimController
    OSGIS.osm = new OpenLayers.Layer.OSM(
        "OSGIS.Kartenserver (OSM Mapnik)", [
            "http://a.tile.maps.deutsche-digitale-bibliothek.de/${z}/${x}/${y}.png",
            "http://maps.deutsche-digitale-bibliothek.de/${z}/${x}/${y}.png"
            //"http://opentopomap.org/${z}/${x}/${y}.png"
        ],
        {
            numZoomLevels: 18,
            maxZoomLevel: 17,
            visibility: false,
            animationEnabled: false,
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
        }
    );
    OSGIS.map = new OpenLayers.Map({
        div: document.getElementById("map"),
        controls: [
            new OpenLayers.Control.Navigation({
            }),
            new OpenLayers.Control.Attribution(),
            OSGIS.nominatimController,
        ],
        transitionEffect: null,
        zoomMethod: null,
        zoomDuration: 10,
        numZoomLevels: 22,
        layers:[OSGIS.osm],
        projection: OSGIS.mercator,
        displayProjection: OSGIS.geographic,
        units: 'm'
    });
    OSGIS.map.updateSize()
    OSGIS.map.addControl(new OSGIS.Search({div:document.getElementById("ddbsearch")}))
    if (!OSGIS.globals.mobile) {
        OSGIS.map.addControls([
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.Permalink(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.OverviewMap({
                div: document.getElementById('overview-map'),
                size: new OpenLayers.Size(240, 200),
                mapOptions: {
                    projection: OSGIS.mercator,
                    units: "m",
                    maxExtent: OSGIS.bounds,
                    restrictedExtent: OSGIS.bounds
                }
            })
        ])
    }
    if (!OSGIS.map.getCenter()) {
        OSGIS.map.zoomToExtent(OSGIS.initial_bounds);
    }
    OSGIS.poivectorlayer = new OpenLayers.Layer.Vector("poi_vector",{
        displayInLayerSwitcher:false,
        isBaseLayer: false,
        visibility: true
    })
    OSGIS.map.addLayer(OSGIS.poivectorlayer);
    OSGIS.map.setCenter(OSGIS.center, 8);


}
