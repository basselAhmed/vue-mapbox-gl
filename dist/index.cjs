var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/vue-mapbox-gl/index.js
var vue_mapbox_gl_exports = {};
__export(vue_mapbox_gl_exports, {
  MapboxCluster: () => MapboxCluster_default,
  MapboxGeocoder: () => MapboxGeocoder_default,
  MapboxGeolocateControl: () => MapboxGeolocateControl_default,
  MapboxImage: () => MapboxImage_default,
  MapboxImages: () => MapboxImages_default,
  MapboxLayer: () => MapboxLayer_default,
  MapboxMap: () => MapboxMap_default,
  MapboxMarker: () => MapboxMarker_default,
  MapboxNavigationControl: () => MapboxNavigationControl_default,
  MapboxPopup: () => MapboxPopup_default,
  MapboxSource: () => MapboxSource_default,
  StoreLocator: () => StoreLocator_default,
  VueScroller: () => VueScroller_default,
  useControl: () => useControl,
  useEventsBinding: () => useEventsBinding,
  useMap: () => useMap,
  usePropsBinding: () => usePropsBinding
});
module.exports = __toCommonJS(vue_mapbox_gl_exports);

// packages/vue-mapbox-gl/components/StoreLocator/StoreLocator.vue
var import_vue17 = require("vue");
var import_vue18 = require("vue");

// packages/vue-mapbox-gl/components/MapboxCluster.vue
var import_vue9 = require("vue");
var import_vue10 = require("vue");

// packages/vue-mapbox-gl/composables/useControl.js
var import_vue4 = require("vue");

// packages/vue-mapbox-gl/composables/useMap.js
var import_vue = require("vue");
function useMap() {
  const map = (0, import_vue.inject)("mapbox-map");
  return {
    map
  };
}

// packages/vue-mapbox-gl/composables/useEventsBinding.js
var import_vue2 = require("vue");
var cache = /* @__PURE__ */ new Map();
var regex = /onMb([A-Z])(.+)/;
function getOriginalEvent(vueEventName) {
  if (!cache.has(vueEventName)) {
    cache.set(
      vueEventName,
      vueEventName.replace(regex, (match, $1, $2) => $1.toLowerCase() + $2)
    );
  }
  return cache.get(vueEventName);
}
function useEventsBinding(emitFn, mapboxElement, events7 = [], layerId = null) {
  const attrs = (0, import_vue2.useAttrs)();
  const vueEventNames = (0, import_vue2.computed)(
    () => Object.entries(attrs).filter(([name, value]) => name.startsWith("on") && typeof value === "function").map(([name]) => name)
  );
  const unbindFunctions = /* @__PURE__ */ new Map();
  function unbindEvents(eventNames) {
    if (!Array.isArray(eventNames)) {
      return;
    }
    eventNames.forEach((eventName) => {
      const unbindFn = unbindFunctions.get(eventName);
      if (typeof unbindFn === "function") {
        unbindFn();
      }
    });
  }
  function bindEvents(eventNames) {
    if (!Array.isArray(eventNames)) {
      return;
    }
    eventNames.forEach((eventName) => {
      const originalEvent = getOriginalEvent(eventName);
      if (!events7.includes(originalEvent)) {
        return;
      }
      const handler = (...payload) => {
        emitFn(`mb-${originalEvent}`, ...payload);
      };
      if (layerId) {
        (0, import_vue2.unref)(mapboxElement).on(originalEvent, layerId, handler);
        unbindFunctions.set(eventName, () => {
          (0, import_vue2.unref)(mapboxElement).off(originalEvent, layerId, handler);
        });
      } else {
        (0, import_vue2.unref)(mapboxElement).on(originalEvent, handler);
        unbindFunctions.set(eventName, () => {
          (0, import_vue2.unref)(mapboxElement).off(originalEvent, handler);
        });
      }
    });
  }
  (0, import_vue2.watch)(
    vueEventNames,
    (newVueEventNames, oldVueEventNames) => {
      const eventNamesToDelete = Array.isArray(newVueEventNames) ? (oldVueEventNames != null ? oldVueEventNames : []).filter(
        (oldVueEventName) => !newVueEventNames.includes(oldVueEventName)
      ) : oldVueEventNames != null ? oldVueEventNames : [];
      const eventNamesToAdd = Array.isArray(oldVueEventNames) ? (newVueEventNames != null ? newVueEventNames : []).filter(
        (newVueEventName) => !oldVueEventNames.includes(newVueEventName)
      ) : newVueEventNames != null ? newVueEventNames : [];
      if ((0, import_vue2.unref)(mapboxElement)) {
        unbindEvents(eventNamesToDelete);
        bindEvents(eventNamesToAdd);
      } else {
        const unwatch = (0, import_vue2.watch)(mapboxElement, (newValue) => {
          if (newValue) {
            unbindEvents(eventNamesToDelete);
            bindEvents(eventNamesToAdd);
            unwatch();
          }
        });
      }
    },
    { immediate: true }
  );
}

// packages/vue-mapbox-gl/composables/usePropsBinding.js
var import_vue3 = require("vue");
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function usePropsBinding(props, mapboxElement, propsConfig10) {
  function bindProps(element) {
    Object.keys(props).filter((prop) => props[prop] !== void 0 && props[prop] !== null).forEach((prop) => {
      var _a, _b;
      const setMethodName = prop === "mapStyle" ? "setStyle" : `set${capitalizeFirstLetter(prop)}`;
      const methodExists = typeof element[setMethodName] === "function";
      const propNeedsBinding = typeof propsConfig10[prop] === "undefined" || "bind" in propsConfig10[prop] ? (_b = (_a = propsConfig10[prop]) == null ? void 0 : _a.bind) != null ? _b : false : true;
      if (!methodExists || !propNeedsBinding) {
        return;
      }
      const { type } = props[prop];
      const options = {
        deep: type === Object || Array.isArray(type) && type.includes(Object)
      };
      (0, import_vue3.watch)(
        () => props[prop],
        (newValue) => {
          element[setMethodName](newValue);
        },
        options
      );
    });
  }
  if ((0, import_vue3.unref)(mapboxElement)) {
    bindProps((0, import_vue3.unref)(mapboxElement));
  } else {
    const unwatch = (0, import_vue3.watch)(mapboxElement, (newValue) => {
      if (newValue) {
        bindProps(newValue);
        unwatch();
      }
    });
  }
}

// packages/vue-mapbox-gl/composables/useControl.js
function useControl(ControlConstructor, { propsConfig: propsConfig10, props, emit, events: events7 = [] }) {
  const { map } = useMap();
  const control = (0, import_vue4.ref)();
  if (Array.isArray(events7) && events7.length) {
    useEventsBinding(emit, control, events7);
  }
  if (typeof propsConfig10 !== "undefined") {
    usePropsBinding(props, control, propsConfig10);
  }
  (0, import_vue4.watch)(
    () => props.position,
    (newValue) => {
      if ((0, import_vue4.unref)(map)) {
        (0, import_vue4.unref)(map).removeControl((0, import_vue4.unref)(control)).addControl((0, import_vue4.unref)(control), newValue);
      }
    }
  );
  (0, import_vue4.onMounted)(async () => {
    const ctrl = new ControlConstructor(props);
    if ((0, import_vue4.unref)(map)) {
      (0, import_vue4.unref)(map).addControl(ctrl, props.position);
    }
    await (0, import_vue4.nextTick)();
    control.value = ctrl;
  });
  (0, import_vue4.onUnmounted)(() => {
    if ((0, import_vue4.unref)(control) && (0, import_vue4.unref)(map)) {
      (0, import_vue4.unref)(map).removeControl((0, import_vue4.unref)(control));
    }
  });
  return {
    control,
    map
  };
}

// packages/vue-mapbox-gl/components/MapboxLayer.vue
var import_vue5 = require("vue");
var import_vue6 = require("vue");

// unplugin-vue:/plugin-vue/export-helper
var export_helper_default = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

// packages/vue-mapbox-gl/components/MapboxLayer.vue
var _hoisted_1 = ["id"];
var propsConfig = {
  /**
   * Id of the layer
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addlayer
   * @type {string}
   */
  id: {
    type: String,
    required: true
  },
  /**
   * Options for the layer
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addlayer
   * @see  https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers
   * @type {Object}
   */
  options: {
    type: Object,
    default: () => {
    }
  },
  /**
   * The ID of an existing layer to insert the new layer before.
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addlayer
   * @type {string}
   */
  beforeId: {
    type: String,
    default: void 0
  }
};
var events = [
  "mousedown",
  "mouseup",
  "click",
  "dblclick",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",
  "touchstart",
  "touchend",
  "touchcancel"
];
var _sfc_main = {
  __name: "MapboxLayer",
  props: propsConfig,
  setup(__props, { emit }) {
    const props = __props;
    const { map } = useMap();
    const options = (0, import_vue6.computed)(() => {
      const opts = { ...props.options, id: props.id };
      if (opts.paint === null || opts.paint === void 0) {
        delete opts.paint;
      }
      if (opts.layout === null || opts.layout === void 0) {
        delete opts.layout;
      }
      return opts;
    });
    useEventsBinding(emit, map, events, props.id);
    function removeLayer() {
      if (typeof (0, import_vue6.unref)(map).getLayer(props.id) !== "undefined") {
        (0, import_vue6.unref)(map).removeLayer(props.id);
      }
    }
    function removeSource() {
      if (typeof (0, import_vue6.unref)(map).getSource(props.id) !== "undefined") {
        (0, import_vue6.unref)(map).removeSource(props.id);
      }
    }
    (0, import_vue6.onMounted)(() => {
      removeLayer();
      removeSource();
      (0, import_vue6.unref)(map).addLayer((0, import_vue6.unref)(options), props.beforeId);
    });
    (0, import_vue6.onUnmounted)(() => {
      removeLayer();
      removeSource();
    });
    return (_ctx, _cache) => {
      return (0, import_vue5.openBlock)(), (0, import_vue5.createElementBlock)("div", { id: _ctx.id }, null, 8, _hoisted_1);
    };
  }
};
var MapboxLayer_default = /* @__PURE__ */ export_helper_default(_sfc_main, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxLayer.vue"]]);

// packages/vue-mapbox-gl/components/MapboxSource.vue
var import_vue7 = require("vue");
var import_vue8 = require("vue");
var _hoisted_12 = ["id"];
var _sfc_main2 = {
  __name: "MapboxSource",
  props: {
    options: {
      type: Object,
      default: () => {
      }
    },
    id: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { map } = useMap();
    (0, import_vue8.watch)(
      () => props.options.data,
      (newValue) => {
        (0, import_vue8.unref)(map).getSource(props.id).setData(newValue);
      }
    );
    (0, import_vue8.onMounted)(() => {
      (0, import_vue8.unref)(map).addSource(props.id, props.options);
    });
    (0, import_vue8.onUnmounted)(() => {
      const { _layers: layers } = (0, import_vue8.unref)(map).style;
      Object.values(layers).forEach((value) => {
        if (value.source === props.id) {
          (0, import_vue8.unref)(map).removeLayer(value.id);
        }
      });
      (0, import_vue8.unref)(map).removeSource(props.id);
    });
    return (_ctx, _cache) => {
      return (0, import_vue7.openBlock)(), (0, import_vue7.createElementBlock)("div", { id: __props.id }, null, 8, _hoisted_12);
    };
  }
};
var MapboxSource_default = /* @__PURE__ */ export_helper_default(_sfc_main2, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxSource.vue"]]);

// packages/vue-mapbox-gl/components/MapboxCluster.vue
var _hoisted_13 = ["id"];
var propsConfig2 = {
  /**
   * The source of the data for the clustered points,
   * must be a String or an Object of GeoJSON format.
   * @type {string | GeoJSON}
   */
  data: {
    type: [String, Object],
    required: true
  },
  /**
   * The max zoom to cluster points on
   * @type {number}
   */
  clusterMaxZoom: {
    type: Number,
    default: 14
  },
  /**
   * Radius of each cluster when clustering point
   * @type {number}
   */
  clusterRadius: {
    type: Number,
    default: 50
  },
  /**
   * The layout configuration for the clusters circles
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  clustersLayout: {
    type: Object,
    default: () => ({})
  },
  /**
   * The paint configuration for the clusters circles
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  clustersPaint: {
    type: Object,
    default: () => ({
      "circle-color": "#000",
      "circle-radius": 40
    })
  },
  /**
   * The layout configuration for the clusters count
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  clusterCountLayout: {
    type: Object,
    default: () => ({
      "text-field": ["get", "point_count_abbreviated"]
    })
  },
  /**
   * The paint configuration for the clusters count
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  clusterCountPaint: {
    type: Object,
    default: () => ({
      "text-color": "white"
    })
  },
  /**
   * The type of the unclustered points layer
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {string}
   */
  unclusteredPointLayerType: {
    type: String,
    default: "circle"
  },
  /**
   * The layout configuration for the unclustered points
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  unclusteredPointLayout: {
    type: Object,
    default: () => ({})
  },
  /**
   * The paint configuration for the unclustered points
   * @see  https://docs.mapbox.com/mapbox-gl-js/example/cluster/
   * @type {Object}
   */
  unclusteredPointPaint: {
    type: Object,
    default: () => ({
      "circle-color": "#000",
      "circle-radius": 4
    })
  }
};
var index = 0;
var _sfc_main3 = {
  __name: "MapboxCluster",
  props: propsConfig2,
  setup(__props, { emit }) {
    const props = __props;
    const { map } = useMap();
    const id = (0, import_vue10.ref)(`mb-cluster-${index}`);
    index += 1;
    const getId = (suffix) => `${(0, import_vue10.unref)(id)}-${suffix}`;
    const sourceId = (0, import_vue10.computed)(() => getId("source"));
    const source = (0, import_vue10.computed)(() => {
      const { data, clusterMaxZoom, clusterRadius } = props;
      return {
        type: "geojson",
        cluster: true,
        data,
        clusterMaxZoom,
        clusterRadius
      };
    });
    const clustersLayer = (0, import_vue10.computed)(() => ({
      id: getId("clusters"),
      type: "circle",
      source: (0, import_vue10.unref)(sourceId),
      filter: ["has", "point_count"],
      layout: props.clustersLayout,
      paint: props.clustersPaint
    }));
    const clusterCountLayer = (0, import_vue10.computed)(() => ({
      id: getId("cluster-count"),
      type: "symbol",
      source: (0, import_vue10.unref)(sourceId),
      filter: ["has", "point_count"],
      layout: props.clusterCountLayout,
      paint: props.clusterCountPaint
    }));
    const unclusteredPointLayer = (0, import_vue10.computed)(() => ({
      id: getId("unclustered-point"),
      type: props.unclusteredPointLayerType,
      source: (0, import_vue10.unref)(sourceId),
      filter: ["!", ["has", "point_count"]],
      layout: props.unclusteredPointLayout,
      paint: props.unclusteredPointPaint
    }));
    function clustersClickHandler(event) {
      const feature = (0, import_vue10.unref)(map).queryRenderedFeatures(event.point, {
        layers: [(0, import_vue10.unref)(clustersLayer).id]
      })[0];
      const { cluster_id: clusterId } = feature.properties;
      emit("mb-cluster-click", clusterId, event);
      if (event.defaultPrevented) {
        return;
      }
      (0, import_vue10.unref)(map).getSource((0, import_vue10.unref)(sourceId)).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        (0, import_vue10.unref)(map).easeTo({
          center: feature.geometry.coordinates,
          zoom
        });
      });
    }
    function clustersMouseenterHandler() {
      (0, import_vue10.unref)(map).getCanvas().style.cursor = "pointer";
    }
    function clustersMouseleaveHandler() {
      (0, import_vue10.unref)(map).getCanvas().style.cursor = "";
    }
    function unclusteredPointClickHandler(event) {
      const [feature] = event.features;
      emit("mb-feature-click", feature, event);
    }
    function unclusteredPointMouseenterHandler(event) {
      const [feature] = event.features;
      emit("mb-feature-mouseenter", feature, event);
      (0, import_vue10.unref)(map).getCanvas().style.cursor = "pointer";
    }
    function unclusteredPointMouseleaveHandler(event) {
      emit("mb-feature-mouseleave", event);
      (0, import_vue10.unref)(map).getCanvas().style.cursor = "";
    }
    return (_ctx, _cache) => {
      return (0, import_vue9.openBlock)(), (0, import_vue9.createElementBlock)("div", { id: id.value }, [
        (0, import_vue9.createVNode)(MapboxSource_default, {
          id: (0, import_vue9.unref)(sourceId),
          options: (0, import_vue9.unref)(source)
        }, null, 8, ["id", "options"]),
        (0, import_vue9.createVNode)(MapboxLayer_default, {
          id: (0, import_vue9.unref)(clustersLayer).id,
          options: (0, import_vue9.unref)(clustersLayer),
          onMbClick: clustersClickHandler,
          onMbMouseenter: clustersMouseenterHandler,
          onMbMouseleave: clustersMouseleaveHandler
        }, null, 8, ["id", "options"]),
        (0, import_vue9.createVNode)(MapboxLayer_default, {
          id: (0, import_vue9.unref)(clusterCountLayer).id,
          options: (0, import_vue9.unref)(clusterCountLayer)
        }, null, 8, ["id", "options"]),
        (0, import_vue9.createVNode)(MapboxLayer_default, {
          id: (0, import_vue9.unref)(unclusteredPointLayer).id,
          options: (0, import_vue9.unref)(unclusteredPointLayer),
          onMbClick: unclusteredPointClickHandler,
          onMbMouseenter: unclusteredPointMouseenterHandler,
          onMbMouseleave: unclusteredPointMouseleaveHandler
        }, null, 8, ["id", "options"])
      ], 8, _hoisted_13);
    };
  }
};
var MapboxCluster_default = /* @__PURE__ */ export_helper_default(_sfc_main3, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxCluster.vue"]]);

// packages/vue-mapbox-gl/components/MapboxGeocoder.vue
var import_vue11 = require("vue");
var import_vue12 = require("vue");
var import_mapbox_gl = __toESM(require("mapbox-gl"));
var import_mapbox_gl_geocoder = __toESM(require("@mapbox/mapbox-gl-geocoder"));
if (!import_mapbox_gl.default) {
  throw new Error("mapboxgl is not installed.");
}
if (!import_mapbox_gl_geocoder.default) {
  throw new Error("MapboxGeocoder is not installed.");
}
var propsConfig3 = {
  accessToken: {
    type: String,
    default: "no-token"
  },
  zoom: {
    type: Number,
    default: 16
  },
  flyTo: {
    type: [Boolean, Object],
    default: true
  },
  placeholder: {
    type: String,
    default: "Search"
  },
  proximity: {
    type: Object,
    default: () => ({})
  },
  trackProximity: {
    type: Boolean,
    default: true
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  clearAndBlurOnEsc: {
    type: Boolean,
    default: false
  },
  clearOnBlur: {
    type: Boolean,
    default: false
  },
  bbox: {
    type: Array,
    default: () => []
  },
  countries: {
    type: String,
    default: ""
  },
  types: {
    type: String,
    default: "place"
  },
  minLength: {
    type: Number,
    default: 2
  },
  limit: {
    type: Number,
    default: 5
  },
  language: {
    type: String,
    default: void 0
  },
  filter: {
    type: Function,
    default: void 0
  },
  localGeocoder: {
    type: Function,
    default: void 0
  },
  reverseMode: {
    type: String,
    default: "distance"
  },
  reverseGeocode: {
    type: Boolean,
    default: false
  },
  enableEventLogging: {
    type: Boolean,
    default: false
  },
  marker: {
    type: Boolean,
    default: true
  },
  render: {
    type: Function,
    default: void 0
  },
  getItemValue: {
    type: Function,
    default: (item) => item.place_name
  },
  mode: {
    type: String,
    default: "mapbox.places"
  },
  localGeocoderOnly: {
    type: Boolean,
    default: false
  }
};
var events2 = ["clear", "loading", "results", "result", "error"];
var _sfc_main4 = {
  __name: "MapboxGeocoder",
  props: propsConfig3,
  setup(__props, { expose, emit }) {
    const props = __props;
    const root = (0, import_vue12.ref)();
    const options = (0, import_vue12.computed)(() => {
      var _a;
      const opts = {
        mapboxgl: import_mapbox_gl.default,
        ...props,
        accessToken: (_a = import_mapbox_gl.default.accessToken) != null ? _a : props.accessToken
      };
      if (!opts.reverseGeocode || true) {
        delete opts.reverseMode;
      }
      return opts;
    });
    const { control, map } = useControl(import_mapbox_gl_geocoder.default, {
      propsConfig: propsConfig3,
      props: (0, import_vue12.unref)(options),
      emit,
      events: events2
    });
    (0, import_vue12.onMounted)(() => {
      const stop = (0, import_vue12.watch)(control, (newValue) => {
        if (newValue && !(0, import_vue12.unref)(map) && (0, import_vue12.unref)(root)) {
          newValue.addTo((0, import_vue12.unref)(root));
          stop();
        }
      });
    });
    expose({ control });
    return (_ctx, _cache) => {
      return (0, import_vue11.openBlock)(), (0, import_vue11.createElementBlock)(
        "div",
        {
          ref_key: "root",
          ref: root
        },
        null,
        512
        /* NEED_PATCH */
      );
    };
  }
};
var MapboxGeocoder_default = /* @__PURE__ */ export_helper_default(_sfc_main4, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxGeocoder.vue"]]);

// packages/vue-mapbox-gl/components/MapboxMap.vue
var import_vue13 = require("vue");
var import_vue14 = require("vue");
var import_mapbox_gl2 = __toESM(require("mapbox-gl"));
var _hoisted_14 = { key: 0 };
var _hoisted_2 = { key: 1 };
if (!import_mapbox_gl2.default) {
  throw new Error("mapboxgl is not installed.");
}
var { LngLatBounds, LngLat } = import_mapbox_gl2.default;
var propsConfig4 = {
  accessToken: {
    type: String,
    default: "no-token"
  },
  container: {
    type: [typeof HTMLElement !== "undefined" && HTMLElement, String],
    default: void 0
  },
  minZoom: {
    type: Number,
    default: 0
  },
  maxZoom: {
    type: Number,
    default: 22
  },
  minPitch: {
    type: Number,
    default: 0
  },
  maxPitch: {
    type: Number,
    default: 60
  },
  mapStyle: {
    type: [Object, String],
    required: true
  },
  hash: {
    type: Boolean,
    default: false
  },
  interactive: {
    type: Boolean,
    default: true
  },
  bearingSnap: {
    type: Number,
    default: 7
  },
  pitchWithRotate: {
    type: Boolean,
    default: true
  },
  clickTolerance: {
    type: Number,
    default: 3
  },
  attributionControl: {
    type: Boolean,
    default: true
  },
  customAttribution: {
    type: [String, Array],
    default: null
  },
  logoPosition: {
    type: String,
    default: "bottom-left"
  },
  failIfMajorPerformanceCaveat: {
    type: Boolean,
    default: false
  },
  preserveDrawingBuffer: {
    type: Boolean,
    default: false
  },
  antialias: {
    type: Boolean,
    default: false
  },
  refreshExpiredTiles: {
    type: Boolean,
    default: true
  },
  maxBounds: {
    type: [LngLatBounds, Array],
    default: void 0
  },
  scrollZoom: {
    type: [Boolean, Object],
    default: true
  },
  boxZoom: {
    type: Boolean,
    default: true
  },
  dragRotate: {
    type: Boolean,
    default: true
  },
  dragPan: {
    type: [Boolean, Object],
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  doubleClickZoom: {
    type: Boolean,
    default: true
  },
  touchZoomRotate: {
    type: [Boolean, Object],
    default: true
  },
  trackResize: {
    type: Boolean,
    default: true
  },
  center: {
    type: [LngLat, Array, Object],
    default: () => [0, 0]
  },
  zoom: {
    type: Number,
    default: 0
  },
  bearing: {
    type: Number,
    default: 0
  },
  pitch: {
    type: Number,
    default: 0
  },
  bounds: {
    type: [LngLatBounds, Array],
    default: void 0
  },
  fitBoundsOptions: {
    type: Object,
    default: null
  },
  renderWorldCopies: {
    type: Boolean,
    default: true
  },
  maxTileCacheSize: {
    type: Number,
    default: null
  },
  localIdeographFontFamily: {
    type: String,
    default: "sans-serif"
  },
  transformRequest: {
    type: Function,
    default: null
  },
  collectResourceTiming: {
    type: Boolean,
    default: false
  },
  fadeDuration: {
    type: Number,
    default: 300
  },
  crossSourceCollisions: {
    type: Boolean,
    default: true
  }
};
var events3 = [
  "boxzoomcancel",
  "boxzoomend",
  "boxzoomstart",
  "click",
  "contextmenu",
  "data",
  "dataloading",
  "dblclick",
  "drag",
  "dragend",
  "dragstart",
  "error",
  "idle",
  "load",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "move",
  "moveend",
  "movestart",
  "pitch",
  "pitchend",
  "pitchstart",
  "remove",
  "render",
  "resize",
  "rotate",
  "rotateend",
  "rotatestart",
  "sourcedata",
  "sourcedataloading",
  "styledata",
  "styledataloading",
  "styleimagemissing",
  "touchcancel",
  "touchend",
  "touchmove",
  "touchstart",
  "webglcontextlost",
  "webglcontextrestored",
  "wheel",
  "zoom",
  "zoomend",
  "zoomstart"
];
var __default__ = {
  inheritAttrs: false
};
var _sfc_main5 = /* @__PURE__ */ Object.assign(__default__, {
  __name: "MapboxMap",
  props: propsConfig4,
  setup(__props, { expose, emit }) {
    const props = __props;
    const attrs = (0, import_vue14.useAttrs)();
    const map = (0, import_vue14.ref)();
    (0, import_vue14.provide)("mapbox-map", map);
    const root = (0, import_vue14.ref)();
    const isLoaded = (0, import_vue14.ref)(false);
    const options = (0, import_vue14.computed)(() => {
      const { accessToken, mapStyle: style, ...options2 } = props;
      if (!options2.container && root.value) {
        options2.container = root.value;
      }
      return { style, ...options2 };
    });
    useEventsBinding(emit, map, events3);
    usePropsBinding(props, map, propsConfig4);
    (0, import_vue14.onMounted)(() => {
      import_mapbox_gl2.default.accessToken = props.accessToken;
      map.value = new import_mapbox_gl2.default.Map({ ...options.value, ...attrs });
      map.value.on("load", () => {
        isLoaded.value = true;
      });
      emit("mb-created", map.value);
      const resizeObserver = new ResizeObserver(() => {
        map.value.resize();
      });
      resizeObserver.observe(options.value.container);
      (0, import_vue14.onUnmounted)(() => {
        resizeObserver.disconnect();
        map.value.remove();
      });
    });
    expose({ map });
    return (_ctx, _cache) => {
      return (0, import_vue13.openBlock)(), (0, import_vue13.createElementBlock)(
        import_vue13.Fragment,
        null,
        [
          (0, import_vue13.createElementVNode)(
            "div",
            (0, import_vue13.mergeProps)({
              ref_key: "root",
              ref: root
            }, _ctx.$attrs),
            null,
            16
            /* FULL_PROPS */
          ),
          isLoaded.value ? ((0, import_vue13.openBlock)(), (0, import_vue13.createElementBlock)("div", _hoisted_14, [
            (0, import_vue13.renderSlot)(_ctx.$slots, "default")
          ])) : ((0, import_vue13.openBlock)(), (0, import_vue13.createElementBlock)("div", _hoisted_2, [
            (0, import_vue13.renderSlot)(_ctx.$slots, "loader")
          ]))
        ],
        64
        /* STABLE_FRAGMENT */
      );
    };
  }
});
var MapboxMap_default = /* @__PURE__ */ export_helper_default(_sfc_main5, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxMap.vue"]]);

// packages/vue-mapbox-gl/components/StoreLocator/VueScroller.vue
var import_vue15 = require("vue");
var import_vue16 = require("vue");

// node_modules/@studiometa/js-toolkit/utils/debounce.js
function debounce(fn, delay = 300) {
  let timeout;
  return function debounced(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// packages/vue-mapbox-gl/components/StoreLocator/VueScroller.vue
var _hoisted_15 = { class: "scroller__content" };
var _sfc_main6 = {
  __name: "VueScroller",
  emits: ["scroll-top", "scroll-bottom"],
  setup(__props, { emit }) {
    const scroller = (0, import_vue16.ref)();
    const scrollTop = (0, import_vue16.ref)(0);
    const scrollMax = (0, import_vue16.ref)(Number.POSITIVE_INFINITY);
    function setVars() {
      if (!(0, import_vue16.unref)(scroller)) {
        return;
      }
      const unrefScroller = (0, import_vue16.unref)(scroller);
      scrollTop.value = unrefScroller.scrollTop;
      scrollMax.value = unrefScroller.scrollHeight - unrefScroller.clientHeight;
      if (scrollTop.value === 0) {
        emit("scroll-top");
      }
      if (scrollTop.value === scrollMax.value) {
        emit("scroll-bottom");
      }
    }
    const debouncedSetVars = debounce(setVars);
    (0, import_vue16.onUpdated)(() => {
      setVars();
    });
    (0, import_vue16.onMounted)(async () => {
      (0, import_vue16.unref)(scroller).addEventListener("scroll", setVars, { passive: true });
      window.addEventListener("resized", debouncedSetVars);
      await (0, import_vue16.nextTick)();
      setVars();
    });
    (0, import_vue16.onBeforeUnmount)(() => {
      (0, import_vue16.unref)(scroller).removeEventListener("scroll", setVars);
      window.removeEventListener("resized", debouncedSetVars);
    });
    return (_ctx, _cache) => {
      return (0, import_vue15.openBlock)(), (0, import_vue15.createElementBlock)(
        "div",
        {
          class: (0, import_vue15.normalizeClass)(["scroller", {
            "scroller--is-top": scrollTop.value === 0,
            "scroller--is-bottom": scrollTop.value === scrollMax.value,
            "scroller--has-no-scroll": scrollTop.value === 0 && scrollMax.value === 0
          }])
        },
        [
          (0, import_vue15.createElementVNode)(
            "div",
            {
              ref_key: "scroller",
              ref: scroller,
              class: "scroller__inner"
            },
            [
              (0, import_vue15.createElementVNode)("div", _hoisted_15, [
                (0, import_vue15.createCommentVNode)(" @slot Use this slot to display the scroller content. "),
                (0, import_vue15.renderSlot)(_ctx.$slots, "default")
              ])
            ],
            512
            /* NEED_PATCH */
          )
        ],
        2
        /* CLASS */
      );
    };
  }
};
var VueScroller_default = /* @__PURE__ */ export_helper_default(_sfc_main6, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/StoreLocator/VueScroller.vue"]]);

// packages/vue-mapbox-gl/components/StoreLocator/StoreLocator.vue
var _hoisted_16 = ["onClick"];
var _hoisted_22 = /* @__PURE__ */ (0, import_vue17.createElementVNode)(
  "br",
  null,
  null,
  -1
  /* HOISTED */
);
var _sfc_main7 = {
  __name: "StoreLocator",
  props: {
    /**
     * A list of items to display.
     * The only required properties are `lat` and `lng` and `id`.
     *
     * @type {Array<{ lat: number, lng: number, id: string } & Record<string, unknown>>}
     */
    items: {
      type: Array,
      required: true
    },
    /**
     * The zoom level to use when zooming in on an item.
     *
     * @type {number}
     */
    itemZoomLevel: {
      type: Number,
      default: 14
    },
    /**
     * A Mapbox access token.
     * @type {Object}
     */
    accessToken: {
      type: String,
      default: "no-token"
    },
    /**
     * Props for the MapboxMap component.
     *
     * @see  https://vue-mapbox-gl.meta.fr/components/MapboxMap.html#props
     * @type {Object}
     */
    mapboxMap: {
      type: Object,
      default: () => ({})
    },
    /**
     * Props fof the MapboxCluster component.
     *
     * @see  https://vue-mapbox-gl.meta.fr/components/MapboxCluster.html#props
     * @type {Object}
     */
    mapboxCluster: {
      type: Object,
      default: () => ({})
    },
    /**
     * Props for the MapboxGeocoder component.
     *
     * @see  https://vue-mapbox-gl.meta.fr/components/MapboxGeocoder.html#props
     * @type {Object}
     */
    mapboxGeocoder: {
      type: Object,
      default: () => ({})
    },
    /**
     * Configuration for each transition component.
     * @type {Object}
     */
    transitions: {
      type: Object,
      default: () => ({
        loader: {
          map: {},
          search: {},
          list: {},
          default: {}
        },
        panel: {}
      })
    },
    /**
     * Define custom classes for each element of the component.
     * @type {Object}
     */
    classes: {
      type: Object,
      default: () => {
        const root = "store-locator";
        const bem = (name, modifier = "") => `${root}__${name}${modifier ? `--${modifier}` : ""}`;
        return {
          root,
          region: {
            map: [bem("region"), bem("region", "map")],
            search: [bem("region"), bem("region", "search")],
            list: [bem("region"), bem("region", "list")],
            panel: [bem("region"), bem("region", "panel")]
          },
          map: bem("map"),
          search: bem("search"),
          list: bem("list"),
          listItem: bem("list-item"),
          panel: bem("panel")
        };
      }
    }
  },
  setup(__props, { emit }) {
    const props = __props;
    const map = (0, import_vue18.ref)();
    const isLoading = (0, import_vue18.ref)(true);
    const mapIsMoving = (0, import_vue18.ref)(false);
    const selectedItem = (0, import_vue18.ref)(null);
    const filteredItems = (0, import_vue18.ref)(props.items.map((item) => item));
    const listIsLoading = (0, import_vue18.ref)(false);
    function itemToGeoJsonFeature({ lat, lng, ...properties }) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        properties
      };
    }
    const geoJson = (0, import_vue18.computed)(() => ({
      type: "FeatureCollection",
      features: props.items.map(itemToGeoJsonFeature)
    }));
    const filteredGeoJson = (0, import_vue18.computed)(() => ({
      type: "FeatureCollection",
      features: (0, import_vue18.unref)(filteredItems).map(itemToGeoJsonFeature)
    }));
    async function filterFeaturesInView() {
      listIsLoading.value = true;
      const mapBounds = (0, import_vue18.unref)(map).getBounds();
      const center = (0, import_vue18.unref)(map).getCenter();
      filteredItems.value = props.items.filter(({ lng, lat }) => mapBounds.contains([lng, lat])).sort((a, b) => {
        const distanceFromA = center.distanceTo(a);
        const distanceFromB = center.distanceTo(b);
        if (distanceFromA < distanceFromB) {
          return -1;
        }
        if (distanceFromA > distanceFromB) {
          return 1;
        }
        return 0;
      });
      await (0, import_vue18.nextTick)();
      listIsLoading.value = false;
    }
    function onGeocoderResult({ result }) {
      if (result.bbox) {
        (0, import_vue18.unref)(map).fitBounds(result.bbox);
      } else if (result.center) {
        (0, import_vue18.unref)(map).flyTo({ center: result.center });
      }
    }
    function onGeocoderCreated(geocoder) {
      emit("geocoder-created", geocoder);
    }
    async function onMapCreated(instance) {
      map.value = instance;
      emit("map-created", instance);
      await (0, import_vue18.nextTick)();
      filterFeaturesInView();
    }
    async function onMapLoad() {
      await (0, import_vue18.nextTick)();
      isLoading.value = false;
      emit("map-load", map);
    }
    async function onMapMovestart() {
      mapIsMoving.value = true;
      await (0, import_vue18.nextTick)();
      listIsLoading.value = true;
    }
    function onMapMoveend() {
      mapIsMoving.value = false;
      filterFeaturesInView();
    }
    function onListItemClick(item) {
      selectedItem.value = item;
      emit("select-item", item);
      const { lat, lng } = (0, import_vue18.unref)(map).getCenter();
      if (Math.abs(lng - item.lng) > 1e-4 && Math.abs(lat - item.lat) > 1e-4) {
        (0, import_vue18.unref)(map).flyTo({ center: [item.lng, item.lat], zoom: props.itemZoomLevel });
      }
    }
    function onClusterFeatureClick(feature, event) {
      const item = props.items.find(({ id }) => id === feature.properties.id);
      emit("cluster-feature-click", feature, event);
      if (item) {
        emit("select-item", item);
        selectedItem.value = item;
        (0, import_vue18.unref)(map).flyTo({ center: feature.geometry.coordinates, zoom: props.itemZoomLevel });
      }
    }
    return (_ctx, _cache) => {
      return (0, import_vue17.openBlock)(), (0, import_vue17.createElementBlock)(
        "div",
        {
          class: (0, import_vue17.normalizeClass)(__props.classes.root || {})
        },
        [
          (0, import_vue17.createElementVNode)(
            "div",
            {
              class: (0, import_vue17.normalizeClass)((__props.classes.region || {}).map || {})
            },
            [
              isLoading.value ? ((0, import_vue17.openBlock)(), (0, import_vue17.createBlock)(
                import_vue17.Transition,
                (0, import_vue17.normalizeProps)((0, import_vue17.mergeProps)({ key: 0 }, (__props.transitions.loader || {}).map || {})),
                {
                  default: (0, import_vue17.withCtx)(() => [
                    (0, import_vue17.renderSlot)(_ctx.$slots, "map-loader", {}, () => [
                      (0, import_vue17.createVNode)(
                        import_vue17.Transition,
                        (0, import_vue17.normalizeProps)((0, import_vue17.guardReactiveProps)((__props.transitions.loader || {}).default || {})),
                        {
                          default: (0, import_vue17.withCtx)(() => [
                            (0, import_vue17.renderSlot)(_ctx.$slots, "loader", {}, () => [
                              (0, import_vue17.createTextVNode)("Loading...")
                            ])
                          ]),
                          _: 3
                          /* FORWARDED */
                        },
                        16
                        /* FULL_PROPS */
                      )
                    ])
                  ]),
                  _: 3
                  /* FORWARDED */
                },
                16
                /* FULL_PROPS */
              )) : (0, import_vue17.createCommentVNode)("v-if", true),
              (0, import_vue17.createCommentVNode)(" @slot Use this slot to display information before the map. "),
              (0, import_vue17.renderSlot)(_ctx.$slots, "before-map"),
              (0, import_vue17.createVNode)(MapboxMap_default, (0, import_vue17.mergeProps)({
                class: __props.classes.map || {}
              }, { ...__props.mapboxMap, accessToken: __props.accessToken }, {
                onMbCreated: onMapCreated,
                onMbMovestart: onMapMovestart,
                onMbMoveend: onMapMoveend,
                onMbLoad: onMapLoad
              }), {
                default: (0, import_vue17.withCtx)(() => [
                  (0, import_vue17.createVNode)(
                    MapboxCluster_default,
                    (0, import_vue17.mergeProps)({ ...__props.mapboxCluster, data: (0, import_vue17.unref)(filteredGeoJson) }, {
                      onMbFeatureClick: onClusterFeatureClick,
                      onMbFeatureMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.$emit("cluster-feature-mouseenter", ...args)),
                      onMbFeatureMouseleave: _cache[1] || (_cache[1] = (...args) => _ctx.$emit("cluster-feature-mouseleave", ...args)),
                      onMbClusterClick: _cache[2] || (_cache[2] = (...args) => _ctx.$emit("cluster-cluster-click", ...args))
                    }),
                    null,
                    16
                    /* FULL_PROPS */
                  ),
                  (0, import_vue17.createCommentVNode)("\n          @slot Use this slot to add components from @studiometa/vue-mapbox-gl to the map.\n          @binding {Object}  map             The map instance.\n          @binding {GeoJSON} geojson         The GeoJSON used for the cluster.\n          @binding {GeoJSON} filteredGeoJson The filtered GeoJSON.\n          @binding {Array}   items           The list of items.\n          @binding {Array}   filteredItems   The filtered list of items.\n          @binding {Object}  selectedItem    The selected item.\n        "),
                  (0, import_vue17.renderSlot)(_ctx.$slots, "map", {
                    map: map.value,
                    geojson: (0, import_vue17.unref)(geoJson),
                    filteredGeojson: (0, import_vue17.unref)(filteredGeoJson),
                    items: __props.items,
                    filteredItems: filteredItems.value,
                    selectedItem: selectedItem.value
                  })
                ]),
                _: 3
                /* FORWARDED */
              }, 16, ["class"]),
              (0, import_vue17.createCommentVNode)(" @slot Use this slot to display information after the map. "),
              (0, import_vue17.renderSlot)(_ctx.$slots, "after-map")
            ],
            2
            /* CLASS */
          ),
          (0, import_vue17.createElementVNode)(
            "div",
            {
              class: (0, import_vue17.normalizeClass)((__props.classes.region || {}).search || {})
            },
            [
              isLoading.value ? ((0, import_vue17.openBlock)(), (0, import_vue17.createBlock)(
                import_vue17.Transition,
                (0, import_vue17.normalizeProps)((0, import_vue17.mergeProps)({ key: 0 }, (__props.transitions.loader || {}).search || {})),
                {
                  default: (0, import_vue17.withCtx)(() => [
                    (0, import_vue17.renderSlot)(_ctx.$slots, "search-loader", {}, () => [
                      (0, import_vue17.createVNode)(
                        import_vue17.Transition,
                        (0, import_vue17.normalizeProps)((0, import_vue17.guardReactiveProps)((__props.transitions.loader || {}).default || {})),
                        {
                          default: (0, import_vue17.withCtx)(() => [
                            (0, import_vue17.renderSlot)(_ctx.$slots, "loader", {}, () => [
                              (0, import_vue17.createTextVNode)("Loading...")
                            ])
                          ]),
                          _: 3
                          /* FORWARDED */
                        },
                        16
                        /* FULL_PROPS */
                      )
                    ])
                  ]),
                  _: 3
                  /* FORWARDED */
                },
                16
                /* FULL_PROPS */
              )) : (0, import_vue17.createCommentVNode)("v-if", true),
              (0, import_vue17.createCommentVNode)(" @slot Use this slot to display information before the search. "),
              (0, import_vue17.renderSlot)(_ctx.$slots, "before-search", {
                items: __props.items,
                filteredItems: filteredItems.value,
                selectedItem: selectedItem.value
              }),
              (0, import_vue17.createVNode)(MapboxGeocoder_default, (0, import_vue17.mergeProps)({
                class: __props.classes.search || {}
              }, { ...__props.mapboxGeocoder, accessToken: __props.accessToken }, {
                onMbResult: onGeocoderResult,
                onMbCreated: onGeocoderCreated
              }), null, 16, ["class"]),
              (0, import_vue17.createCommentVNode)(" @slot Use this slot to display information after the search. "),
              (0, import_vue17.renderSlot)(_ctx.$slots, "after-search", {
                items: __props.items,
                filteredItems: filteredItems.value,
                selectedItem: selectedItem.value
              })
            ],
            2
            /* CLASS */
          ),
          (0, import_vue17.createElementVNode)(
            "div",
            {
              class: (0, import_vue17.normalizeClass)((__props.classes.region || {}).list || {})
            },
            [
              isLoading.value || listIsLoading.value ? ((0, import_vue17.openBlock)(), (0, import_vue17.createBlock)(
                import_vue17.Transition,
                (0, import_vue17.normalizeProps)((0, import_vue17.mergeProps)({ key: 0 }, (__props.transitions.loader || {}).list || {})),
                {
                  default: (0, import_vue17.withCtx)(() => [
                    (0, import_vue17.renderSlot)(_ctx.$slots, "list-loader", {}, () => [
                      (0, import_vue17.createVNode)(
                        import_vue17.Transition,
                        (0, import_vue17.normalizeProps)((0, import_vue17.guardReactiveProps)((__props.transitions.loader || {}).default || {})),
                        {
                          default: (0, import_vue17.withCtx)(() => [
                            (0, import_vue17.renderSlot)(_ctx.$slots, "loader", {}, () => [
                              (0, import_vue17.createTextVNode)("Loading...")
                            ])
                          ]),
                          _: 3
                          /* FORWARDED */
                        },
                        16
                        /* FULL_PROPS */
                      )
                    ])
                  ]),
                  _: 3
                  /* FORWARDED */
                },
                16
                /* FULL_PROPS */
              )) : ((0, import_vue17.openBlock)(), (0, import_vue17.createElementBlock)(
                import_vue17.Fragment,
                { key: 1 },
                [
                  (0, import_vue17.createCommentVNode)("\n          @slot Use this slot to display information before the list.\n          @binding {Array} items         The full list of items.\n          @binding {Array} filteredItems The filtered list of items.\n        "),
                  (0, import_vue17.renderSlot)(_ctx.$slots, "before-list", {
                    items: __props.items,
                    filteredItems: filteredItems.value,
                    selectedItem: selectedItem.value
                  }, () => [
                    (0, import_vue17.createElementVNode)(
                      "p",
                      null,
                      "Result(s): " + (0, import_vue17.toDisplayString)(filteredItems.value.length.toFixed(0)),
                      1
                      /* TEXT */
                    )
                  ]),
                  filteredItems.value.length > 0 ? ((0, import_vue17.openBlock)(), (0, import_vue17.createBlock)(VueScroller_default, { key: 0 }, {
                    default: (0, import_vue17.withCtx)(() => [
                      (0, import_vue17.createElementVNode)(
                        "ul",
                        {
                          class: (0, import_vue17.normalizeClass)(__props.classes.list || {})
                        },
                        [
                          ((0, import_vue17.openBlock)(true), (0, import_vue17.createElementBlock)(
                            import_vue17.Fragment,
                            null,
                            (0, import_vue17.renderList)(filteredItems.value, (item, index2) => {
                              return (0, import_vue17.openBlock)(), (0, import_vue17.createElementBlock)("li", {
                                key: item.id,
                                class: (0, import_vue17.normalizeClass)(__props.classes.listItem || {}),
                                onClick: ($event) => onListItemClick(item)
                              }, [
                                (0, import_vue17.createCommentVNode)("\n                @slot Use this slot to customize the display of the list items.\n                @binding {Object} item          An item.\n                @binding {Object} selected-item The currently selected item.\n              "),
                                (0, import_vue17.renderSlot)(_ctx.$slots, "list-item", {
                                  item,
                                  index: index2,
                                  selectedItem: selectedItem.value
                                }, () => [
                                  (0, import_vue17.createTextVNode)(
                                    " Lat: " + (0, import_vue17.toDisplayString)(item.lat) + " ",
                                    1
                                    /* TEXT */
                                  ),
                                  _hoisted_22,
                                  (0, import_vue17.createTextVNode)(
                                    " Lng: " + (0, import_vue17.toDisplayString)(item.lng),
                                    1
                                    /* TEXT */
                                  )
                                ])
                              ], 10, _hoisted_16);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ],
                        2
                        /* CLASS */
                      )
                    ]),
                    _: 3
                    /* FORWARDED */
                  })) : (0, import_vue17.createCommentVNode)("v-if", true),
                  (0, import_vue17.createCommentVNode)("\n          @slot Use this slot to display information after the list.\n          @binding {Array} items         The full list of items.\n          @binding {Array} filteredItems The filtered list of items.\n        "),
                  (0, import_vue17.renderSlot)(_ctx.$slots, "after-list", {
                    items: __props.items,
                    filteredItems: filteredItems.value,
                    selectedItem: selectedItem.value,
                    filterFeaturesInView
                  })
                ],
                64
                /* STABLE_FRAGMENT */
              ))
            ],
            2
            /* CLASS */
          ),
          (0, import_vue17.createElementVNode)(
            "div",
            {
              class: (0, import_vue17.normalizeClass)((__props.classes.region || {}).panel || {})
            },
            [
              (0, import_vue17.createVNode)(
                import_vue17.Transition,
                (0, import_vue17.normalizeProps)((0, import_vue17.guardReactiveProps)(__props.transitions.panel || {})),
                {
                  default: (0, import_vue17.withCtx)(() => [
                    selectedItem.value ? ((0, import_vue17.openBlock)(), (0, import_vue17.createElementBlock)(
                      "div",
                      {
                        key: selectedItem.value.id,
                        class: (0, import_vue17.normalizeClass)(__props.classes.panel || {})
                      },
                      [
                        (0, import_vue17.createCommentVNode)("\n            @slot Use this slot to display content inside the panel.\n            @binding {Object}   item  The selected item.\n            @binging {Function} close A function to close the panel\n          "),
                        (0, import_vue17.renderSlot)(_ctx.$slots, "panel", {
                          item: selectedItem.value,
                          close: () => selectedItem.value = null
                        }, () => [
                          (0, import_vue17.createElementVNode)(
                            "div",
                            null,
                            (0, import_vue17.toDisplayString)(selectedItem.value),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      2
                      /* CLASS */
                    )) : (0, import_vue17.createCommentVNode)("v-if", true)
                  ]),
                  _: 3
                  /* FORWARDED */
                },
                16
                /* FULL_PROPS */
              )
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      );
    };
  }
};
var StoreLocator_default = /* @__PURE__ */ export_helper_default(_sfc_main7, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/StoreLocator/StoreLocator.vue"]]);

// packages/vue-mapbox-gl/components/MapboxGeolocateControl.vue
var import_vue19 = require("vue");
var import_mapbox_gl3 = __toESM(require("mapbox-gl"));
if (!import_mapbox_gl3.default) {
  throw new Error("mapboxgl is not installed.");
}
var { GeolocateControl } = import_mapbox_gl3.default;
var propsConfig5 = {
  positionOptions: {
    type: Object,
    default: () => ({ enableHighAccuracy: false, timeout: 6e3 })
  },
  fitBoundsOptions: {
    type: Object,
    default: () => ({ maxZoom: 15 })
  },
  trackUserLocation: {
    type: Boolean,
    default: false
  },
  showAccuracyCircle: {
    type: Boolean,
    default: true
  },
  showUserHeading: {
    type: Boolean,
    default: true
  },
  showUserLocation: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: "top-right",
    bind: false
  }
};
var events4 = [
  "trackuserlocationend",
  "error",
  "geolocate",
  "outofmaxbounds",
  "trackuserlocationstart"
];
var _sfc_main8 = {
  __name: "MapboxGeolocateControl",
  props: propsConfig5,
  setup(__props, { expose, emit }) {
    const props = __props;
    const { control } = useControl(GeolocateControl, { propsConfig: propsConfig5, events: events4, props, emit });
    expose({ control });
    return (_ctx, _cache) => {
      return (0, import_vue19.openBlock)(), (0, import_vue19.createElementBlock)("div");
    };
  }
};
var MapboxGeolocateControl_default = /* @__PURE__ */ export_helper_default(_sfc_main8, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxGeolocateControl.vue"]]);

// packages/vue-mapbox-gl/components/MapboxImage.vue
var import_vue20 = require("vue");
var import_vue21 = require("vue");
var _hoisted_17 = ["id"];
var propsConfig6 = {
  /**
   * The ID of the image
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addimage
   * @type {string}
   */
  id: {
    type: String,
    required: true
  },
  /**
   * The image as String, an HTMLImageElement, ImageData, or object with
   * width, height, and data properties with the same format as ImageData.
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addimage
   * @type {string | HTMLImageElement | ImageData | Object}
   */
  src: {
    type: [
      String,
      typeof HTMLImageElement !== "undefined" && HTMLImageElement,
      typeof ImageData !== "undefined" && ImageData,
      Object
    ],
    required: true
  },
  /**
   * The options object for the image to add
   * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addimage
   * @type {Object}
   */
  options: {
    type: Object,
    default: () => ({ pixelRatio: 1, sdf: false })
  }
};
var _sfc_main9 = {
  __name: "MapboxImage",
  props: propsConfig6,
  setup(__props, { emit }) {
    const props = __props;
    const { map } = useMap();
    const isReady = (0, import_vue21.ref)(false);
    async function loadImage(src) {
      return new Promise((resolve, reject) => {
        (0, import_vue21.unref)(map).loadImage(src, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }
    (0, import_vue21.watch)(
      () => props.src,
      async (newValue) => {
        const image = typeof newValue !== "string" ? newValue : await loadImage(newValue);
        (0, import_vue21.unref)(map).updateImage(props.id, image);
      },
      { deep: true }
    );
    (0, import_vue21.onMounted)(async () => {
      const { id, src, options } = props;
      const image = typeof src !== "string" ? src : await loadImage(src);
      (0, import_vue21.unref)(map).addImage(id, image, options);
      emit("mb-add", { id, image, options });
      isReady.value = true;
    });
    (0, import_vue21.onUnmounted)(() => {
      if ((0, import_vue21.unref)(map) && (0, import_vue21.unref)(map).hasImage(props.id)) {
        (0, import_vue21.unref)(map).removeImage(props.id);
      }
    });
    return (_ctx, _cache) => {
      return (0, import_vue20.openBlock)(), (0, import_vue20.createElementBlock)("div", { id: _ctx.id }, [
        isReady.value ? (0, import_vue20.renderSlot)(_ctx.$slots, "default", { key: 0 }) : (0, import_vue20.createCommentVNode)("v-if", true)
      ], 8, _hoisted_17);
    };
  }
};
var MapboxImage_default = /* @__PURE__ */ export_helper_default(_sfc_main9, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxImage.vue"]]);

// packages/vue-mapbox-gl/components/MapboxImages.vue
var import_vue22 = require("vue");
var import_vue23 = require("vue");
var _sfc_main10 = {
  __name: "MapboxImages",
  props: {
    /**
     * A list of sources to add to the map
     * @see  https://docs.mapbox.com/mapbox-gl-js/api/#map#addimage
     * @see  ./MapboxImage.vue
     * @type {Object}
     */
    sources: {
      type: Array,
      required: true
    }
  },
  setup(__props, { emit }) {
    const props = __props;
    const isReady = (0, import_vue23.ref)(false);
    const addedImages = /* @__PURE__ */ new Map();
    function addHandler(image, index2) {
      if (!addedImages.has(image.id)) {
        addedImages.set(image.id, image);
        emit("mb-add", image, index2, props.sources.length);
      }
      if (addedImages.size === props.sources.length) {
        isReady.value = true;
        emit("mb-ready", addedImages.values());
      }
    }
    return (_ctx, _cache) => {
      return (0, import_vue22.openBlock)(), (0, import_vue22.createElementBlock)("div", null, [
        ((0, import_vue22.openBlock)(true), (0, import_vue22.createElementBlock)(
          import_vue22.Fragment,
          null,
          (0, import_vue22.renderList)(__props.sources, (source, index2) => {
            return (0, import_vue22.openBlock)(), (0, import_vue22.createBlock)(MapboxImage_default, (0, import_vue22.mergeProps)({
              key: `mapbox-images-${source.id}`
            }, source, {
              onMbAdd: ($event) => addHandler($event, index2 + 1)
            }), null, 16, ["onMbAdd"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        isReady.value ? (0, import_vue22.renderSlot)(_ctx.$slots, "default", { key: 0 }) : (0, import_vue22.createCommentVNode)("v-if", true)
      ]);
    };
  }
};
var MapboxImages_default = /* @__PURE__ */ export_helper_default(_sfc_main10, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxImages.vue"]]);

// packages/vue-mapbox-gl/components/MapboxMarker.vue
var import_vue26 = require("vue");
var import_vue27 = require("vue");

// packages/vue-mapbox-gl/components/MapboxPopup.vue
var import_vue24 = require("vue");
var import_vue25 = require("vue");
var import_mapbox_gl4 = __toESM(require("mapbox-gl"));
var { Popup, Point, LngLat: LngLat2 } = import_mapbox_gl4.default;
var propsConfig7 = {
  lngLat: {
    type: [LngLat2, Array, Object],
    required: true
  },
  closeButton: {
    type: Boolean,
    default: true
  },
  closeOnClick: {
    type: Boolean,
    default: true
  },
  closeOnMove: {
    type: Boolean,
    default: false
  },
  anchor: {
    type: String,
    default: null
  },
  offset: {
    type: [Number, Point, Array, Object],
    default: 0
  },
  className: {
    type: String,
    default: null
  },
  maxWidth: {
    type: String,
    default: "240px"
  },
  /**
   * Do not render the popup on the map.
   * @type {Object}
   */
  renderless: {
    type: Boolean,
    default: false,
    bind: false
  }
};
var events5 = ["open", "close"];
var _sfc_main11 = {
  __name: "MapboxPopup",
  props: propsConfig7,
  setup(__props, { expose, emit }) {
    const props = __props;
    const attrs = (0, import_vue25.useAttrs)();
    const popup = (0, import_vue25.ref)();
    const root = (0, import_vue25.ref)();
    const options = (0, import_vue25.computed)(() => {
      const { lngLat, ...options2 } = props;
      return options2;
    });
    usePropsBinding(props, popup, propsConfig7);
    useEventsBinding(emit, popup, events5);
    (0, import_vue25.onMounted)(() => {
      const { map } = useMap();
      popup.value = new Popup({ ...options.value, ...attrs }).setLngLat(props.lngLat).setDOMContent(root.value);
      if (!props.renderless) {
        popup.value.addTo(map.value);
      }
      emit("mb-open", popup.value);
    });
    (0, import_vue25.onUnmounted)(() => {
      if (popup.value) {
        popup.value.remove();
      }
    });
    expose({ popup });
    return (_ctx, _cache) => {
      return (0, import_vue24.openBlock)(), (0, import_vue24.createElementBlock)(
        "div",
        {
          ref_key: "root",
          ref: root
        },
        [
          (0, import_vue24.renderSlot)(_ctx.$slots, "default")
        ],
        512
        /* NEED_PATCH */
      );
    };
  }
};
var MapboxPopup_default = /* @__PURE__ */ export_helper_default(_sfc_main11, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxPopup.vue"]]);

// packages/vue-mapbox-gl/components/MapboxMarker.vue
var import_mapbox_gl5 = __toESM(require("mapbox-gl"));
var { Marker, Point: Point2 } = import_mapbox_gl5.default;
var propsConfig8 = {
  lngLat: {
    type: Array,
    required: true
  },
  popup: {
    type: [Object, Boolean],
    default: false,
    bind: false
  },
  element: {
    type: typeof HTMLElement !== "undefined" ? HTMLElement : Object,
    default: null
  },
  offset: {
    type: [Point2, Array],
    default: null
  },
  anchor: {
    type: String,
    default: "center"
  },
  color: {
    type: String,
    default: null
  },
  scale: {
    type: Number,
    default: 1
  },
  draggable: {
    type: Boolean,
    default: false
  },
  rotation: {
    type: Number,
    default: 0
  },
  pitchAlignment: {
    type: String,
    default: "auto"
  },
  rotationAlignment: {
    type: String,
    default: "auto"
  }
};
var events6 = ["dragstart", "drag", "dragend"];
var _sfc_main12 = {
  __name: "MapboxMarker",
  props: propsConfig8,
  setup(__props, { emit }) {
    const props = __props;
    const slots = (0, import_vue27.useSlots)();
    const marker = (0, import_vue27.ref)();
    const contentRef = (0, import_vue27.ref)();
    const popupRef = (0, import_vue27.ref)();
    const hasPopup = (0, import_vue27.computed)(() => typeof slots.popup !== "undefined");
    const popupInstance = (0, import_vue27.computed)(() => hasPopup.value ? popupRef.value.popup : null);
    const popupOptions = (0, import_vue27.computed)(() => ({
      lngLat: props.lngLat,
      ...props.popup ? props.popup : {},
      renderless: true
    }));
    const options = (0, import_vue27.computed)(() => {
      const { lngLat, popup, ...options2 } = props;
      if (slots.default) {
        options2.element = contentRef.value;
      }
      return options2;
    });
    usePropsBinding(props, marker, propsConfig8);
    useEventsBinding(emit, marker, events6);
    (0, import_vue27.onMounted)(() => {
      const { map } = useMap();
      marker.value = new Marker(options.value).setLngLat(props.lngLat).addTo(map.value);
      if (hasPopup.value) {
        marker.value.setPopup(popupInstance.value);
      }
    });
    (0, import_vue27.onUnmounted)(() => {
      if (marker.value) {
        marker.value.remove();
      }
    });
    return (_ctx, _cache) => {
      return (0, import_vue26.openBlock)(), (0, import_vue26.createElementBlock)("div", null, [
        (0, import_vue26.createElementVNode)(
          "div",
          {
            ref_key: "contentRef",
            ref: contentRef
          },
          [
            (0, import_vue26.renderSlot)(_ctx.$slots, "default")
          ],
          512
          /* NEED_PATCH */
        ),
        (0, import_vue26.unref)(hasPopup) ? ((0, import_vue26.openBlock)(), (0, import_vue26.createBlock)(
          MapboxPopup_default,
          (0, import_vue26.mergeProps)({
            key: 0,
            ref_key: "popupRef",
            ref: popupRef
          }, (0, import_vue26.unref)(popupOptions)),
          {
            default: (0, import_vue26.withCtx)(() => [
              (0, import_vue26.renderSlot)(_ctx.$slots, "popup")
            ]),
            _: 3
            /* FORWARDED */
          },
          16
          /* FULL_PROPS */
        )) : (0, import_vue26.createCommentVNode)("v-if", true)
      ]);
    };
  }
};
var MapboxMarker_default = /* @__PURE__ */ export_helper_default(_sfc_main12, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxMarker.vue"]]);

// packages/vue-mapbox-gl/components/MapboxNavigationControl.vue
var import_vue28 = require("vue");
var import_mapbox_gl6 = __toESM(require("mapbox-gl"));
var propsConfig9 = {
  showCompass: {
    type: Boolean,
    default: true
  },
  showZoom: {
    type: Boolean,
    default: true
  },
  visualizePitch: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: "top-right",
    bind: false
  }
};
var _sfc_main13 = {
  __name: "MapboxNavigationControl",
  props: propsConfig9,
  setup(__props, { expose }) {
    const props = __props;
    const { NavigationControl } = import_mapbox_gl6.default;
    const { control } = useControl(NavigationControl, { props, propsConfig: propsConfig9 });
    expose({ control });
    return (_ctx, _cache) => {
      return (0, import_vue28.openBlock)(), (0, import_vue28.createElementBlock)("div");
    };
  }
};
var MapboxNavigationControl_default = /* @__PURE__ */ export_helper_default(_sfc_main13, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxNavigationControl.vue"]]);
//# sourceMappingURL=index.cjs.map
