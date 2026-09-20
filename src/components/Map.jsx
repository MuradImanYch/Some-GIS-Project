import { useEffect, useRef, useState } from "react";

// basic imports for OpenLayers map setup
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";

// control imports
import FullScreen from "ol/control/FullScreen";
import ScaleLine from "ol/control/ScaleLine";
import { defaults as defaultControls } from "ol/control";

// projection imports
import { fromLonLat, toLonLat } from "ol/proj";
import Select from "ol/interaction/Select";

// geometry imports
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";

// style imports
import "ol/ol.css";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Meta from "./meta/Meta";

// drawable features: points, lines, polygons
import Draw from "ol/interaction/Draw.js";
import Tools from "./tools/Tools";


function MapComponent() {
  const mapRef = useRef(null); // ref to div where OpenLayers map will be rendered
  const mapInstance = useRef(null); // ref to OpenLayers
  const vectorSourceRef = useRef(null); // ref to OpenLayers vector source instance
  const drawRef = useRef(null); // ref to OpenLayers draw interaction instance
  const selectRef = useRef(null); // ref to OpenLayers select interaction instance

  const[isSelected, setIsSelected] = useState(false);
  const[properties, setProperties] = useState(null);
  const[drawToggle, setDrawToggle] = useState(false);
  const[drawType, setDrawType] = useState(null);
  const[selectActive, setSelectActive] = useState(false);

  useEffect(() => {
    const selectInteraction = new Select();
    selectRef.current = selectInteraction; // store select interaction instance in ref

    // POINT
    const point = new Feature({ // Creating one feature object 
      geometry: new Point(
        fromLonLat([49.8671, 40.4093])
      ),
      name: "Object 1",
      id: 123,
    });

    // Styles for POINT
    point.setStyle(new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "red" }),
        stroke: new Stroke({ color: "red", width: 12 }),
      }),

      text: new Text({
        text: "Kapital Bank",

        font: "bold 16px Arial",

        offsetY: -25,

        fill: new Fill({
          color: "black",
        }),

        stroke: new Stroke({
          color: "white",
          width: 4,
        }),
      }),

      zIndex: 10,
    }));

    // LINESTRING
    const line = new Feature({
      geometry: new LineString([
        fromLonLat([49.85, 40.40]),
        fromLonLat([49.87, 40.41]),
        fromLonLat([49.89, 40.42]),
        fromLonLat([49.99, 40.49]),
      ]),
      name: "Road",
      id: 789,
    });

    // Styles for LINESTRING
    line.setStyle(
      new Style({

        stroke: new Stroke({
          color: "blue",
          width: 6,

          lineDash: [15, 5],

          lineCap: "square",
          lineJoin: "round",
        }),

        text: new Text({
          text: "Road 1",

          font: "bold 15px Arial",

          placement: "line",

          fill: new Fill({
            color: "black",
          }),

          stroke: new Stroke({
            color: "white",
            width: 4,
          }),
        }),

        zIndex: 5,
      })
    );

    // POLYGON
    const polygon = new Feature({
      geometry: new Polygon([
        [
          fromLonLat([49.86, 40.40]),
          fromLonLat([49.87, 40.40]),
          fromLonLat([49.87, 40.41]),
          fromLonLat([49.86, 40.41]),
          fromLonLat([49.86, 40.40]),
        ],
      ]),
      name: "Building",
      id: 456,
    });

    // Styles for POLYGON
    polygon.setStyle(
      new Style({

        fill: new Fill({
          color: "rgba(255, 165, 0, 0.4)",
        }),

        stroke: new Stroke({
          color: "orange",
          width: 4,

          // lineDash: [10, 0],

          lineJoin: "square",
        }),

        text: new Text({
          text: "Building 1",

          font: "bold 16px Arial",

          fill: new Fill({
            color: "black",
          }),

          stroke: new Stroke({
            color: "white",
            width: 4,
          }),
        }),

        zIndex: 2,
      })
    );

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource; // store the vector source in the ref for later use

    vectorSource.addFeatures([point, line, polygon]); // Creating a vector source to hold the features

    const vectorLayer = new VectorLayer({ // Creating a vector layer to display the features
      source: vectorSource,
    });
    

    const map = new Map({
      target: mapRef.current, // Where the map will be rendered

      layers: [
        new TileLayer({ // Where from we will take the map tiles
          source: new OSM(),
        }),
        vectorLayer, // Adding the vector layer to the map
        
      ],

      view: new View({
        center: fromLonLat([49.8671, 40.4093]),
        zoom: 12,
      }),
      controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    });

    mapInstance.current = map;

    map.addInteraction(selectInteraction); // Adding the select interaction to the map

    selectInteraction.setActive(false); // Activating the select interaction by default

    selectInteraction.on("select", (event) => {
      const feature = event.selected[0];

      if(event.selected.length > 0) {
        setIsSelected(true);
        setProperties(feature.getProperties());
      }
      else if(event.deselected.length > 0) {
        setIsSelected(false);
        setProperties(null);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  const toggleDrawFunc = () => { // Draw toggle func
    setDrawToggle(!drawToggle);
    mapInstance.current.removeInteraction(drawRef.current);
    !drawToggle && setDrawType(null);

    // Deactivate the select interaction when toggling draw mode
    setSelectActive(false);
    selectRef.current.setActive(false);
    setIsSelected(false);
    setProperties(null);
    selectRef.current.getFeatures().clear();
  }

  const changeDraw = (type) => { // change draw type func
    // 1. Delete the previous Draw interaction if it exists
    if (drawRef.current) {
      mapInstance.current.removeInteraction(drawRef.current);
    }

    // 2. Create a new Draw interaction
    const draw = new Draw({
      source: vectorSourceRef.current,
      type,
    });

    // 3. Add the new Draw interaction to the map
    mapInstance.current.addInteraction(draw);

    // 4. Remember the current Draw interaction
    drawRef.current = draw;

    setDrawType(type);
  };

  const toggleSelectFunc = () => { // Select toggle func
    setSelectActive(!selectRef.current.getActive()); // select active state
    selectRef.current.setActive(!selectRef.current.getActive()); // Toggle the select interaction's active state
    selectRef.current.getFeatures().clear(); // Clear any selected features before starting to draw a new one
    !selectRef.current.getActive() && setIsSelected(false);
    !selectRef.current.getActive() && setProperties(null);

    // Deactivate the draw interaction and reset its state when selecting features
    setDrawType(null);
    setDrawToggle(false);
    mapInstance.current.removeInteraction(drawRef.current);
  };

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />
      <Tools drawToggle={drawToggle} toggleDrawFunc={toggleDrawFunc} changeDraw={changeDraw} drawType={drawType} toggleSelectFunc={toggleSelectFunc} selectActive={selectActive} />
      {isSelected && <Meta properties={properties} />}
    </>
  );
}

export default MapComponent;