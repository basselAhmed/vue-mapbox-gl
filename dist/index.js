// packages/vue-mapbox-gl/components/StoreLocator/StoreLocator.vue
import { createCommentVNode as _createCommentVNode3, renderSlot as _renderSlot3, createTextVNode as _createTextVNode, Transition as _Transition, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, withCtx as _withCtx, createVNode as _createVNode2, openBlock as _openBlock7, createBlock as _createBlock, mergeProps as _mergeProps2, unref as _unref2, normalizeClass as _normalizeClass2, createElementVNode as _createElementVNode3, toDisplayString as _toDisplayString, renderList as _renderList, Fragment as _Fragment2, createElementBlock as _createElementBlock7 } from "vue";
import { ref as ref6, unref as unref9, computed as computed6, nextTick as nextTick3 } from "vue";

// packages/vue-mapbox-gl/components/MapboxCluster.vue
import { unref as _unref, createVNode as _createVNode, openBlock as _openBlock3, createElementBlock as _createElementBlock3 } from "vue";
import { ref as ref2, unref as unref6, computed as computed3 } from "vue";

// packages/vue-mapbox-gl/composables/useControl.js
import { onMounted, onUnmounted, ref, unref as unref3, watch as watch3, nextTick } from "vue";

// packages/vue-mapbox-gl/composables/useMap.js
import { inject } from "vue";
function useMap() {
  const map = inject("mapbox-map");
  return {
    map
  };
}

// packages/vue-mapbox-gl/composables/useEventsBinding.js
import { watch, computed, useAttrs, unref } from "vue";
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
  const attrs = useAttrs();
  const vueEventNames = computed(
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
        unref(mapboxElement).on(originalEvent, layerId, handler);
        unbindFunctions.set(eventName, () => {
          unref(mapboxElement).off(originalEvent, layerId, handler);
        });
      } else {
        unref(mapboxElement).on(originalEvent, handler);
        unbindFunctions.set(eventName, () => {
          unref(mapboxElement).off(originalEvent, handler);
        });
      }
    });
  }
  watch(
    vueEventNames,
    (newVueEventNames, oldVueEventNames) => {
      const eventNamesToDelete = Array.isArray(newVueEventNames) ? (oldVueEventNames != null ? oldVueEventNames : []).filter(
        (oldVueEventName) => !newVueEventNames.includes(oldVueEventName)
      ) : oldVueEventNames != null ? oldVueEventNames : [];
      const eventNamesToAdd = Array.isArray(oldVueEventNames) ? (newVueEventNames != null ? newVueEventNames : []).filter(
        (newVueEventName) => !oldVueEventNames.includes(newVueEventName)
      ) : newVueEventNames != null ? newVueEventNames : [];
      if (unref(mapboxElement)) {
        unbindEvents(eventNamesToDelete);
        bindEvents(eventNamesToAdd);
      } else {
        const unwatch = watch(mapboxElement, (newValue) => {
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
import { watch as watch2, unref as unref2 } from "vue";
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
      watch2(
        () => props[prop],
        (newValue) => {
          element[setMethodName](newValue);
        },
        options
      );
    });
  }
  if (unref2(mapboxElement)) {
    bindProps(unref2(mapboxElement));
  } else {
    const unwatch = watch2(mapboxElement, (newValue) => {
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
  const control = ref();
  if (Array.isArray(events7) && events7.length) {
    useEventsBinding(emit, control, events7);
  }
  if (typeof propsConfig10 !== "undefined") {
    usePropsBinding(props, control, propsConfig10);
  }
  watch3(
    () => props.position,
    (newValue) => {
      if (unref3(map)) {
        unref3(map).removeControl(unref3(control)).addControl(unref3(control), newValue);
      }
    }
  );
  onMounted(async () => {
    const ctrl = new ControlConstructor(props);
    if (unref3(map)) {
      unref3(map).addControl(ctrl, props.position);
    }
    await nextTick();
    control.value = ctrl;
  });
  onUnmounted(() => {
    if (unref3(control) && unref3(map)) {
      unref3(map).removeControl(unref3(control));
    }
  });
  return {
    control,
    map
  };
}

// packages/vue-mapbox-gl/components/MapboxLayer.vue
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
import { onMounted as onMounted2, onUnmounted as onUnmounted2, computed as computed2, unref as unref4 } from "vue";

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
    const options = computed2(() => {
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
      if (typeof unref4(map).getLayer(props.id) !== "undefined") {
        unref4(map).removeLayer(props.id);
      }
    }
    function removeSource() {
      if (typeof unref4(map).getSource(props.id) !== "undefined") {
        unref4(map).removeSource(props.id);
      }
    }
    onMounted2(() => {
      removeLayer();
      removeSource();
      unref4(map).addLayer(unref4(options), props.beforeId);
    });
    onUnmounted2(() => {
      removeLayer();
      removeSource();
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("div", { id: _ctx.id }, null, 8, _hoisted_1);
    };
  }
};
var MapboxLayer_default = /* @__PURE__ */ export_helper_default(_sfc_main, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxLayer.vue"]]);

// packages/vue-mapbox-gl/components/MapboxSource.vue
import { openBlock as _openBlock2, createElementBlock as _createElementBlock2 } from "vue";
import { unref as unref5, watch as watch4, onMounted as onMounted3, onUnmounted as onUnmounted3 } from "vue";
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
    watch4(
      () => props.options.data,
      (newValue) => {
        unref5(map).getSource(props.id).setData(newValue);
      }
    );
    onMounted3(() => {
      unref5(map).addSource(props.id, props.options);
    });
    onUnmounted3(() => {
      const { _layers: layers } = unref5(map).style;
      Object.values(layers).forEach((value) => {
        if (value.source === props.id) {
          unref5(map).removeLayer(value.id);
        }
      });
      unref5(map).removeSource(props.id);
    });
    return (_ctx, _cache) => {
      return _openBlock2(), _createElementBlock2("div", { id: __props.id }, null, 8, _hoisted_12);
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
    const id = ref2(`mb-cluster-${index}`);
    index += 1;
    const getId = (suffix) => `${unref6(id)}-${suffix}`;
    const sourceId = computed3(() => getId("source"));
    const source = computed3(() => {
      const { data, clusterMaxZoom, clusterRadius } = props;
      return {
        type: "geojson",
        cluster: true,
        data,
        clusterMaxZoom,
        clusterRadius
      };
    });
    const clustersLayer = computed3(() => ({
      id: getId("clusters"),
      type: "circle",
      source: unref6(sourceId),
      filter: ["has", "point_count"],
      layout: props.clustersLayout,
      paint: props.clustersPaint
    }));
    const clusterCountLayer = computed3(() => ({
      id: getId("cluster-count"),
      type: "symbol",
      source: unref6(sourceId),
      filter: ["has", "point_count"],
      layout: props.clusterCountLayout,
      paint: props.clusterCountPaint
    }));
    const unclusteredPointLayer = computed3(() => ({
      id: getId("unclustered-point"),
      type: props.unclusteredPointLayerType,
      source: unref6(sourceId),
      filter: ["!", ["has", "point_count"]],
      layout: props.unclusteredPointLayout,
      paint: props.unclusteredPointPaint
    }));
    function clustersClickHandler(event) {
      const feature = unref6(map).queryRenderedFeatures(event.point, {
        layers: [unref6(clustersLayer).id]
      })[0];
      const { cluster_id: clusterId } = feature.properties;
      emit("mb-cluster-click", clusterId, event);
      if (event.defaultPrevented) {
        return;
      }
      unref6(map).getSource(unref6(sourceId)).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        unref6(map).easeTo({
          center: feature.geometry.coordinates,
          zoom
        });
      });
    }
    function clustersMouseenterHandler() {
      unref6(map).getCanvas().style.cursor = "pointer";
    }
    function clustersMouseleaveHandler() {
      unref6(map).getCanvas().style.cursor = "";
    }
    function unclusteredPointClickHandler(event) {
      const [feature] = event.features;
      emit("mb-feature-click", feature, event);
    }
    function unclusteredPointMouseenterHandler(event) {
      const [feature] = event.features;
      emit("mb-feature-mouseenter", feature, event);
      unref6(map).getCanvas().style.cursor = "pointer";
    }
    function unclusteredPointMouseleaveHandler(event) {
      emit("mb-feature-mouseleave", event);
      unref6(map).getCanvas().style.cursor = "";
    }
    return (_ctx, _cache) => {
      return _openBlock3(), _createElementBlock3("div", { id: id.value }, [
        _createVNode(MapboxSource_default, {
          id: _unref(sourceId),
          options: _unref(source)
        }, null, 8, ["id", "options"]),
        _createVNode(MapboxLayer_default, {
          id: _unref(clustersLayer).id,
          options: _unref(clustersLayer),
          onMbClick: clustersClickHandler,
          onMbMouseenter: clustersMouseenterHandler,
          onMbMouseleave: clustersMouseleaveHandler
        }, null, 8, ["id", "options"]),
        _createVNode(MapboxLayer_default, {
          id: _unref(clusterCountLayer).id,
          options: _unref(clusterCountLayer)
        }, null, 8, ["id", "options"]),
        _createVNode(MapboxLayer_default, {
          id: _unref(unclusteredPointLayer).id,
          options: _unref(unclusteredPointLayer),
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
import { openBlock as _openBlock4, createElementBlock as _createElementBlock4 } from "vue";
import { onMounted as onMounted4, ref as ref3, unref as unref7, computed as computed4, watch as watch5 } from "vue";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
if (!mapboxgl) {
  throw new Error("mapboxgl is not installed.");
}
if (!MapboxGeocoder) {
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
    const root = ref3();
    const options = computed4(() => {
      var _a;
      const opts = {
        mapboxgl,
        ...props,
        accessToken: (_a = mapboxgl.accessToken) != null ? _a : props.accessToken
      };
      if (!opts.reverseGeocode || true) {
        delete opts.reverseMode;
      }
      return opts;
    });
    const { control, map } = useControl(MapboxGeocoder, {
      propsConfig: propsConfig3,
      props: unref7(options),
      emit,
      events: events2
    });
    onMounted4(() => {
      const stop = watch5(control, (newValue) => {
        if (newValue && !unref7(map) && unref7(root)) {
          newValue.addTo(unref7(root));
          stop();
        }
      });
    });
    expose({ control });
    return (_ctx, _cache) => {
      return _openBlock4(), _createElementBlock4(
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
import { mergeProps as _mergeProps, createElementVNode as _createElementVNode, renderSlot as _renderSlot, openBlock as _openBlock5, createElementBlock as _createElementBlock5, createCommentVNode as _createCommentVNode, Fragment as _Fragment } from "vue";
import { ref as ref4, computed as computed5, onMounted as onMounted5, onUnmounted as onUnmounted4, provide, useAttrs as useAttrs2 } from "vue";
import mapboxgl2 from "mapbox-gl";
var _hoisted_14 = { key: 0 };
var _hoisted_2 = { key: 1 };
if (!mapboxgl2) {
  throw new Error("mapboxgl is not installed.");
}
var { LngLatBounds, LngLat } = mapboxgl2;
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
    const attrs = useAttrs2();
    const map = ref4();
    provide("mapbox-map", map);
    const root = ref4();
    const isLoaded = ref4(false);
    const options = computed5(() => {
      const { accessToken, mapStyle: style, ...options2 } = props;
      if (!options2.container && root.value) {
        options2.container = root.value;
      }
      return { style, ...options2 };
    });
    useEventsBinding(emit, map, events3);
    usePropsBinding(props, map, propsConfig4);
    onMounted5(() => {
      mapboxgl2.accessToken = props.accessToken;
      map.value = new mapboxgl2.Map({ ...options.value, ...attrs });
      map.value.on("load", () => {
        isLoaded.value = true;
      });
      emit("mb-created", map.value);
      const resizeObserver = new ResizeObserver(() => {
        map.value.resize();
      });
      resizeObserver.observe(options.value.container);
      onUnmounted4(() => {
        resizeObserver.disconnect();
        map.value.remove();
      });
    });
    expose({ map });
    return (_ctx, _cache) => {
      return _openBlock5(), _createElementBlock5(
        _Fragment,
        null,
        [
          _createElementVNode(
            "div",
            _mergeProps({
              ref_key: "root",
              ref: root
            }, _ctx.$attrs),
            null,
            16
            /* FULL_PROPS */
          ),
          isLoaded.value ? (_openBlock5(), _createElementBlock5("div", _hoisted_14, [
            _renderSlot(_ctx.$slots, "default")
          ])) : (_openBlock5(), _createElementBlock5("div", _hoisted_2, [
            _renderSlot(_ctx.$slots, "loader")
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
import { createCommentVNode as _createCommentVNode2, renderSlot as _renderSlot2, createElementVNode as _createElementVNode2, normalizeClass as _normalizeClass, openBlock as _openBlock6, createElementBlock as _createElementBlock6 } from "vue";
import { ref as ref5, unref as unref8, onUpdated, onMounted as onMounted6, onBeforeUnmount, nextTick as nextTick2 } from "vue";

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
    const scroller = ref5();
    const scrollTop = ref5(0);
    const scrollMax = ref5(Number.POSITIVE_INFINITY);
    function setVars() {
      if (!unref8(scroller)) {
        return;
      }
      const unrefScroller = unref8(scroller);
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
    onUpdated(() => {
      setVars();
    });
    onMounted6(async () => {
      unref8(scroller).addEventListener("scroll", setVars, { passive: true });
      window.addEventListener("resized", debouncedSetVars);
      await nextTick2();
      setVars();
    });
    onBeforeUnmount(() => {
      unref8(scroller).removeEventListener("scroll", setVars);
      window.removeEventListener("resized", debouncedSetVars);
    });
    return (_ctx, _cache) => {
      return _openBlock6(), _createElementBlock6(
        "div",
        {
          class: _normalizeClass(["scroller", {
            "scroller--is-top": scrollTop.value === 0,
            "scroller--is-bottom": scrollTop.value === scrollMax.value,
            "scroller--has-no-scroll": scrollTop.value === 0 && scrollMax.value === 0
          }])
        },
        [
          _createElementVNode2(
            "div",
            {
              ref_key: "scroller",
              ref: scroller,
              class: "scroller__inner"
            },
            [
              _createElementVNode2("div", _hoisted_15, [
                _createCommentVNode2(" @slot Use this slot to display the scroller content. "),
                _renderSlot2(_ctx.$slots, "default")
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
var _hoisted_22 = /* @__PURE__ */ _createElementVNode3(
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
    const map = ref6();
    const isLoading = ref6(true);
    const mapIsMoving = ref6(false);
    const selectedItem = ref6(null);
    const filteredItems = ref6(props.items.map((item) => item));
    const listIsLoading = ref6(false);
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
    const geoJson = computed6(() => ({
      type: "FeatureCollection",
      features: props.items.map(itemToGeoJsonFeature)
    }));
    const filteredGeoJson = computed6(() => ({
      type: "FeatureCollection",
      features: unref9(filteredItems).map(itemToGeoJsonFeature)
    }));
    async function filterFeaturesInView() {
      listIsLoading.value = true;
      const mapBounds = unref9(map).getBounds();
      const center = unref9(map).getCenter();
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
      await nextTick3();
      listIsLoading.value = false;
    }
    function onGeocoderResult({ result }) {
      if (result.bbox) {
        unref9(map).fitBounds(result.bbox);
      } else if (result.center) {
        unref9(map).flyTo({ center: result.center });
      }
    }
    function onGeocoderCreated(geocoder) {
      emit("geocoder-created", geocoder);
    }
    async function onMapCreated(instance) {
      map.value = instance;
      emit("map-created", instance);
      await nextTick3();
      filterFeaturesInView();
    }
    async function onMapLoad() {
      await nextTick3();
      isLoading.value = false;
      emit("map-load", map);
    }
    async function onMapMovestart() {
      mapIsMoving.value = true;
      await nextTick3();
      listIsLoading.value = true;
    }
    function onMapMoveend() {
      mapIsMoving.value = false;
      filterFeaturesInView();
    }
    function onListItemClick(item) {
      selectedItem.value = item;
      emit("select-item", item);
      const { lat, lng } = unref9(map).getCenter();
      if (Math.abs(lng - item.lng) > 1e-4 && Math.abs(lat - item.lat) > 1e-4) {
        unref9(map).flyTo({ center: [item.lng, item.lat], zoom: props.itemZoomLevel });
      }
    }
    function onClusterFeatureClick(feature, event) {
      const item = props.items.find(({ id }) => id === feature.properties.id);
      emit("cluster-feature-click", feature, event);
      if (item) {
        emit("select-item", item);
        selectedItem.value = item;
        unref9(map).flyTo({ center: feature.geometry.coordinates, zoom: props.itemZoomLevel });
      }
    }
    return (_ctx, _cache) => {
      return _openBlock7(), _createElementBlock7(
        "div",
        {
          class: _normalizeClass2(__props.classes.root || {})
        },
        [
          _createElementVNode3(
            "div",
            {
              class: _normalizeClass2((__props.classes.region || {}).map || {})
            },
            [
              isLoading.value ? (_openBlock7(), _createBlock(
                _Transition,
                _normalizeProps(_mergeProps2({ key: 0 }, (__props.transitions.loader || {}).map || {})),
                {
                  default: _withCtx(() => [
                    _renderSlot3(_ctx.$slots, "map-loader", {}, () => [
                      _createVNode2(
                        _Transition,
                        _normalizeProps(_guardReactiveProps((__props.transitions.loader || {}).default || {})),
                        {
                          default: _withCtx(() => [
                            _renderSlot3(_ctx.$slots, "loader", {}, () => [
                              _createTextVNode("Loading...")
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
              )) : _createCommentVNode3("v-if", true),
              _createCommentVNode3(" @slot Use this slot to display information before the map. "),
              _renderSlot3(_ctx.$slots, "before-map"),
              _createVNode2(MapboxMap_default, _mergeProps2({
                class: __props.classes.map || {}
              }, { ...__props.mapboxMap, accessToken: __props.accessToken }, {
                onMbCreated: onMapCreated,
                onMbMovestart: onMapMovestart,
                onMbMoveend: onMapMoveend,
                onMbLoad: onMapLoad
              }), {
                default: _withCtx(() => [
                  _createVNode2(
                    MapboxCluster_default,
                    _mergeProps2({ ...__props.mapboxCluster, data: _unref2(filteredGeoJson) }, {
                      onMbFeatureClick: onClusterFeatureClick,
                      onMbFeatureMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.$emit("cluster-feature-mouseenter", ...args)),
                      onMbFeatureMouseleave: _cache[1] || (_cache[1] = (...args) => _ctx.$emit("cluster-feature-mouseleave", ...args)),
                      onMbClusterClick: _cache[2] || (_cache[2] = (...args) => _ctx.$emit("cluster-cluster-click", ...args))
                    }),
                    null,
                    16
                    /* FULL_PROPS */
                  ),
                  _createCommentVNode3("\n          @slot Use this slot to add components from @studiometa/vue-mapbox-gl to the map.\n          @binding {Object}  map             The map instance.\n          @binding {GeoJSON} geojson         The GeoJSON used for the cluster.\n          @binding {GeoJSON} filteredGeoJson The filtered GeoJSON.\n          @binding {Array}   items           The list of items.\n          @binding {Array}   filteredItems   The filtered list of items.\n          @binding {Object}  selectedItem    The selected item.\n        "),
                  _renderSlot3(_ctx.$slots, "map", {
                    map: map.value,
                    geojson: _unref2(geoJson),
                    filteredGeojson: _unref2(filteredGeoJson),
                    items: __props.items,
                    filteredItems: filteredItems.value,
                    selectedItem: selectedItem.value
                  })
                ]),
                _: 3
                /* FORWARDED */
              }, 16, ["class"]),
              _createCommentVNode3(" @slot Use this slot to display information after the map. "),
              _renderSlot3(_ctx.$slots, "after-map")
            ],
            2
            /* CLASS */
          ),
          _createElementVNode3(
            "div",
            {
              class: _normalizeClass2((__props.classes.region || {}).search || {})
            },
            [
              isLoading.value ? (_openBlock7(), _createBlock(
                _Transition,
                _normalizeProps(_mergeProps2({ key: 0 }, (__props.transitions.loader || {}).search || {})),
                {
                  default: _withCtx(() => [
                    _renderSlot3(_ctx.$slots, "search-loader", {}, () => [
                      _createVNode2(
                        _Transition,
                        _normalizeProps(_guardReactiveProps((__props.transitions.loader || {}).default || {})),
                        {
                          default: _withCtx(() => [
                            _renderSlot3(_ctx.$slots, "loader", {}, () => [
                              _createTextVNode("Loading...")
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
              )) : _createCommentVNode3("v-if", true),
              _createCommentVNode3(" @slot Use this slot to display information before the search. "),
              _renderSlot3(_ctx.$slots, "before-search", {
                items: __props.items,
                filteredItems: filteredItems.value,
                selectedItem: selectedItem.value
              }),
              _createVNode2(MapboxGeocoder_default, _mergeProps2({
                class: __props.classes.search || {}
              }, { ...__props.mapboxGeocoder, accessToken: __props.accessToken }, {
                onMbResult: onGeocoderResult,
                onMbCreated: onGeocoderCreated
              }), null, 16, ["class"]),
              _createCommentVNode3(" @slot Use this slot to display information after the search. "),
              _renderSlot3(_ctx.$slots, "after-search", {
                items: __props.items,
                filteredItems: filteredItems.value,
                selectedItem: selectedItem.value
              })
            ],
            2
            /* CLASS */
          ),
          _createElementVNode3(
            "div",
            {
              class: _normalizeClass2((__props.classes.region || {}).list || {})
            },
            [
              isLoading.value || listIsLoading.value ? (_openBlock7(), _createBlock(
                _Transition,
                _normalizeProps(_mergeProps2({ key: 0 }, (__props.transitions.loader || {}).list || {})),
                {
                  default: _withCtx(() => [
                    _renderSlot3(_ctx.$slots, "list-loader", {}, () => [
                      _createVNode2(
                        _Transition,
                        _normalizeProps(_guardReactiveProps((__props.transitions.loader || {}).default || {})),
                        {
                          default: _withCtx(() => [
                            _renderSlot3(_ctx.$slots, "loader", {}, () => [
                              _createTextVNode("Loading...")
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
              )) : (_openBlock7(), _createElementBlock7(
                _Fragment2,
                { key: 1 },
                [
                  _createCommentVNode3("\n          @slot Use this slot to display information before the list.\n          @binding {Array} items         The full list of items.\n          @binding {Array} filteredItems The filtered list of items.\n        "),
                  _renderSlot3(_ctx.$slots, "before-list", {
                    items: __props.items,
                    filteredItems: filteredItems.value,
                    selectedItem: selectedItem.value
                  }, () => [
                    _createElementVNode3(
                      "p",
                      null,
                      "Result(s): " + _toDisplayString(filteredItems.value.length.toFixed(0)),
                      1
                      /* TEXT */
                    )
                  ]),
                  filteredItems.value.length > 0 ? (_openBlock7(), _createBlock(VueScroller_default, { key: 0 }, {
                    default: _withCtx(() => [
                      _createElementVNode3(
                        "ul",
                        {
                          class: _normalizeClass2(__props.classes.list || {})
                        },
                        [
                          (_openBlock7(true), _createElementBlock7(
                            _Fragment2,
                            null,
                            _renderList(filteredItems.value, (item, index2) => {
                              return _openBlock7(), _createElementBlock7("li", {
                                key: item.id,
                                class: _normalizeClass2(__props.classes.listItem || {}),
                                onClick: ($event) => onListItemClick(item)
                              }, [
                                _createCommentVNode3("\n                @slot Use this slot to customize the display of the list items.\n                @binding {Object} item          An item.\n                @binding {Object} selected-item The currently selected item.\n              "),
                                _renderSlot3(_ctx.$slots, "list-item", {
                                  item,
                                  index: index2,
                                  selectedItem: selectedItem.value
                                }, () => [
                                  _createTextVNode(
                                    " Lat: " + _toDisplayString(item.lat) + " ",
                                    1
                                    /* TEXT */
                                  ),
                                  _hoisted_22,
                                  _createTextVNode(
                                    " Lng: " + _toDisplayString(item.lng),
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
                  })) : _createCommentVNode3("v-if", true),
                  _createCommentVNode3("\n          @slot Use this slot to display information after the list.\n          @binding {Array} items         The full list of items.\n          @binding {Array} filteredItems The filtered list of items.\n        "),
                  _renderSlot3(_ctx.$slots, "after-list", {
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
          _createElementVNode3(
            "div",
            {
              class: _normalizeClass2((__props.classes.region || {}).panel || {})
            },
            [
              _createVNode2(
                _Transition,
                _normalizeProps(_guardReactiveProps(__props.transitions.panel || {})),
                {
                  default: _withCtx(() => [
                    selectedItem.value ? (_openBlock7(), _createElementBlock7(
                      "div",
                      {
                        key: selectedItem.value.id,
                        class: _normalizeClass2(__props.classes.panel || {})
                      },
                      [
                        _createCommentVNode3("\n            @slot Use this slot to display content inside the panel.\n            @binding {Object}   item  The selected item.\n            @binging {Function} close A function to close the panel\n          "),
                        _renderSlot3(_ctx.$slots, "panel", {
                          item: selectedItem.value,
                          close: () => selectedItem.value = null
                        }, () => [
                          _createElementVNode3(
                            "div",
                            null,
                            _toDisplayString(selectedItem.value),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      2
                      /* CLASS */
                    )) : _createCommentVNode3("v-if", true)
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
import { openBlock as _openBlock8, createElementBlock as _createElementBlock8 } from "vue";
import mapboxgl3 from "mapbox-gl";
if (!mapboxgl3) {
  throw new Error("mapboxgl is not installed.");
}
var { GeolocateControl } = mapboxgl3;
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
      return _openBlock8(), _createElementBlock8("div");
    };
  }
};
var MapboxGeolocateControl_default = /* @__PURE__ */ export_helper_default(_sfc_main8, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxGeolocateControl.vue"]]);

// packages/vue-mapbox-gl/components/MapboxImage.vue
import { renderSlot as _renderSlot4, createCommentVNode as _createCommentVNode4, openBlock as _openBlock9, createElementBlock as _createElementBlock9 } from "vue";
import { ref as ref7, unref as unref10, watch as watch6, onMounted as onMounted7, onUnmounted as onUnmounted5 } from "vue";
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
    const isReady = ref7(false);
    async function loadImage(src) {
      return new Promise((resolve, reject) => {
        unref10(map).loadImage(src, (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
      });
    }
    watch6(
      () => props.src,
      async (newValue) => {
        const image = typeof newValue !== "string" ? newValue : await loadImage(newValue);
        unref10(map).updateImage(props.id, image);
      },
      { deep: true }
    );
    onMounted7(async () => {
      const { id, src, options } = props;
      const image = typeof src !== "string" ? src : await loadImage(src);
      unref10(map).addImage(id, image, options);
      emit("mb-add", { id, image, options });
      isReady.value = true;
    });
    onUnmounted5(() => {
      if (unref10(map) && unref10(map).hasImage(props.id)) {
        unref10(map).removeImage(props.id);
      }
    });
    return (_ctx, _cache) => {
      return _openBlock9(), _createElementBlock9("div", { id: _ctx.id }, [
        isReady.value ? _renderSlot4(_ctx.$slots, "default", { key: 0 }) : _createCommentVNode4("v-if", true)
      ], 8, _hoisted_17);
    };
  }
};
var MapboxImage_default = /* @__PURE__ */ export_helper_default(_sfc_main9, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxImage.vue"]]);

// packages/vue-mapbox-gl/components/MapboxImages.vue
import { renderList as _renderList2, Fragment as _Fragment3, openBlock as _openBlock10, createElementBlock as _createElementBlock10, mergeProps as _mergeProps3, createBlock as _createBlock2, renderSlot as _renderSlot5, createCommentVNode as _createCommentVNode5 } from "vue";
import { ref as ref8 } from "vue";
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
    const isReady = ref8(false);
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
      return _openBlock10(), _createElementBlock10("div", null, [
        (_openBlock10(true), _createElementBlock10(
          _Fragment3,
          null,
          _renderList2(__props.sources, (source, index2) => {
            return _openBlock10(), _createBlock2(MapboxImage_default, _mergeProps3({
              key: `mapbox-images-${source.id}`
            }, source, {
              onMbAdd: ($event) => addHandler($event, index2 + 1)
            }), null, 16, ["onMbAdd"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        isReady.value ? _renderSlot5(_ctx.$slots, "default", { key: 0 }) : _createCommentVNode5("v-if", true)
      ]);
    };
  }
};
var MapboxImages_default = /* @__PURE__ */ export_helper_default(_sfc_main10, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxImages.vue"]]);

// packages/vue-mapbox-gl/components/MapboxMarker.vue
import { renderSlot as _renderSlot7, createElementVNode as _createElementVNode4, unref as _unref3, mergeProps as _mergeProps4, withCtx as _withCtx2, openBlock as _openBlock12, createBlock as _createBlock3, createCommentVNode as _createCommentVNode6, createElementBlock as _createElementBlock12 } from "vue";
import { computed as computed8, ref as ref10, onMounted as onMounted9, onUnmounted as onUnmounted7, useSlots } from "vue";

// packages/vue-mapbox-gl/components/MapboxPopup.vue
import { renderSlot as _renderSlot6, openBlock as _openBlock11, createElementBlock as _createElementBlock11 } from "vue";
import { ref as ref9, computed as computed7, onMounted as onMounted8, onUnmounted as onUnmounted6, useAttrs as useAttrs3 } from "vue";
import mapboxgl4 from "mapbox-gl";
var { Popup, Point, LngLat: LngLat2 } = mapboxgl4;
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
    const attrs = useAttrs3();
    const popup = ref9();
    const root = ref9();
    const options = computed7(() => {
      const { lngLat, ...options2 } = props;
      return options2;
    });
    usePropsBinding(props, popup, propsConfig7);
    useEventsBinding(emit, popup, events5);
    onMounted8(() => {
      const { map } = useMap();
      popup.value = new Popup({ ...options.value, ...attrs }).setLngLat(props.lngLat).setDOMContent(root.value);
      if (!props.renderless) {
        popup.value.addTo(map.value);
      }
      emit("mb-open", popup.value);
    });
    onUnmounted6(() => {
      if (popup.value) {
        popup.value.remove();
      }
    });
    expose({ popup });
    return (_ctx, _cache) => {
      return _openBlock11(), _createElementBlock11(
        "div",
        {
          ref_key: "root",
          ref: root
        },
        [
          _renderSlot6(_ctx.$slots, "default")
        ],
        512
        /* NEED_PATCH */
      );
    };
  }
};
var MapboxPopup_default = /* @__PURE__ */ export_helper_default(_sfc_main11, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxPopup.vue"]]);

// packages/vue-mapbox-gl/components/MapboxMarker.vue
import mapboxgl5 from "mapbox-gl";
var { Marker, Point: Point2 } = mapboxgl5;
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
    const slots = useSlots();
    const marker = ref10();
    const contentRef = ref10();
    const popupRef = ref10();
    const hasPopup = computed8(() => typeof slots.popup !== "undefined");
    const popupInstance = computed8(() => hasPopup.value ? popupRef.value.popup : null);
    const popupOptions = computed8(() => ({
      lngLat: props.lngLat,
      ...props.popup ? props.popup : {},
      renderless: true
    }));
    const options = computed8(() => {
      const { lngLat, popup, ...options2 } = props;
      if (slots.default) {
        options2.element = contentRef.value;
      }
      return options2;
    });
    usePropsBinding(props, marker, propsConfig8);
    useEventsBinding(emit, marker, events6);
    onMounted9(() => {
      const { map } = useMap();
      marker.value = new Marker(options.value).setLngLat(props.lngLat).addTo(map.value);
      if (hasPopup.value) {
        marker.value.setPopup(popupInstance.value);
      }
    });
    onUnmounted7(() => {
      if (marker.value) {
        marker.value.remove();
      }
    });
    return (_ctx, _cache) => {
      return _openBlock12(), _createElementBlock12("div", null, [
        _createElementVNode4(
          "div",
          {
            ref_key: "contentRef",
            ref: contentRef
          },
          [
            _renderSlot7(_ctx.$slots, "default")
          ],
          512
          /* NEED_PATCH */
        ),
        _unref3(hasPopup) ? (_openBlock12(), _createBlock3(
          MapboxPopup_default,
          _mergeProps4({
            key: 0,
            ref_key: "popupRef",
            ref: popupRef
          }, _unref3(popupOptions)),
          {
            default: _withCtx2(() => [
              _renderSlot7(_ctx.$slots, "popup")
            ]),
            _: 3
            /* FORWARDED */
          },
          16
          /* FULL_PROPS */
        )) : _createCommentVNode6("v-if", true)
      ]);
    };
  }
};
var MapboxMarker_default = /* @__PURE__ */ export_helper_default(_sfc_main12, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxMarker.vue"]]);

// packages/vue-mapbox-gl/components/MapboxNavigationControl.vue
import { openBlock as _openBlock13, createElementBlock as _createElementBlock13 } from "vue";
import mapboxgl6 from "mapbox-gl";
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
    const { NavigationControl } = mapboxgl6;
    const { control } = useControl(NavigationControl, { props, propsConfig: propsConfig9 });
    expose({ control });
    return (_ctx, _cache) => {
      return _openBlock13(), _createElementBlock13("div");
    };
  }
};
var MapboxNavigationControl_default = /* @__PURE__ */ export_helper_default(_sfc_main13, [["__file", "/Users/basselahmed/code/vue-mapbox-gl/packages/vue-mapbox-gl/components/MapboxNavigationControl.vue"]]);
export {
  MapboxCluster_default as MapboxCluster,
  MapboxGeocoder_default as MapboxGeocoder,
  MapboxGeolocateControl_default as MapboxGeolocateControl,
  MapboxImage_default as MapboxImage,
  MapboxImages_default as MapboxImages,
  MapboxLayer_default as MapboxLayer,
  MapboxMap_default as MapboxMap,
  MapboxMarker_default as MapboxMarker,
  MapboxNavigationControl_default as MapboxNavigationControl,
  MapboxPopup_default as MapboxPopup,
  MapboxSource_default as MapboxSource,
  StoreLocator_default as StoreLocator,
  VueScroller_default as VueScroller,
  useControl,
  useEventsBinding,
  useMap,
  usePropsBinding
};
//# sourceMappingURL=index.js.map
