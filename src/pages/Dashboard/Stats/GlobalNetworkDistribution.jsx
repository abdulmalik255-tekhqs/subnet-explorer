import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ASSETS from "../../../assets";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import useTheme from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_NODES = [
  {
    id: "nyc-rpc",
    name: "New York RPC",
    lat: 40.7128,
    lng: -74.006,
    type: "rpc",
    region: "USA",
  },
  {
    id: "sf-validator",
    name: "San Francisco Validator",
    lat: 37.7749,
    lng: -122.4194,
    type: "validator",
    region: "USA",
  },
  {
    id: "frankfurt-rpc",
    name: "Frankfurt RPC",
    lat: 50.1109,
    lng: 8.6821,
    type: "rpc",
    region: "Europe",
  },
  {
    id: "amsterdam-validator",
    name: "Amsterdam Validator",
    lat: 52.3676,
    lng: 4.9041,
    type: "validator",
    region: "Europe",
  },
  {
    id: "singapore-rpc",
    name: "Singapore RPC",
    lat: 1.3521,
    lng: 103.8198,
    type: "rpc",
    region: "Asia",
  },
  {
    id: "tokyo-validator",
    name: "Tokyo Validator",
    lat: 35.6762,
    lng: 139.6503,
    type: "validator",
    region: "Asia",
  },
  {
    id: "mumbai-rpc",
    name: "Mumbai RPC",
    lat: 19.076,
    lng: 72.8777,
    type: "rpc",
    region: "Asia",
  },
  {
    id: "seoul-validator",
    name: "Seoul Validator",
    lat: 37.5665,
    lng: 126.978,
    type: "validator",
    region: "Asia",
  },
  {
    id: "warsaw-rpc",
    name: "Warsaw RPC",
    lat: 52.2297,
    lng: 21.0122,
    type: "rpc",
    region: "Europe",
  },
  {
    id: "dallas-validator",
    name: "Dallas Validator",
    lat: 32.7767,
    lng: -96.797,
    type: "validator",
    region: "USA",
  },
];

const mapStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm",
    },
  ],
};

const REGION_ORDER = ["Asia", "Europe", "USA"];

const getRegionFromCoordinates = (latitude, longitude) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "Other";
  }

  if (longitude >= -170 && longitude <= -30) {
    return "USA";
  }

  if (longitude > -30 && longitude <= 60) {
    return "Europe";
  }

  if (longitude > 60 && longitude <= 180) {
    return "Asia";
  }

  return "Other";
};

const getNodeLabel = (rpc, index) => {
  if (!rpc) {
    return `Node ${index + 1}`;
  }

  try {
    const parsedUrl = new URL(rpc);
    return parsedUrl.port ? `RPC ${parsedUrl.port}` : parsedUrl.hostname;
  } catch {
    return rpc;
  }
};

const GlobalNetworkDistribution = ({ nodes = DEFAULT_NODES }) => {
  const dispatch = useDispatch();
  const { nodeMap } = useSelector((state) => state.dashboard);
  const { isDarkTheme } = useTheme();
  const mapRef = useRef(null);

  const normalizedNodes = useMemo(() => {
    const liveNodes = Array.isArray(nodeMap?.nodes_location)
      ? nodeMap.nodes_location
      : [];

    if (liveNodes.length) {
      return liveNodes
        .map((node, index) => {
          const latitude = Number(node?.location?.latitude);
          const longitude = Number(node?.location?.longitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
          }

          return {
            id: node?.rpc || `rpc-node-${index}`,
            name: getNodeLabel(node?.rpc, index),
            lat: latitude,
            lng: longitude,
            type: "rpc",
            region: getRegionFromCoordinates(latitude, longitude),
            rpc: node?.rpc,
          };
        })
        .filter(Boolean);
    }

    return nodes
      .map((node, index) => {
        const latitude = Number(node?.lat ?? node?.location?.latitude);
        const longitude = Number(node?.lng ?? node?.location?.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return {
          ...node,
          id: node?.id || `fallback-node-${index}`,
          name: node?.name || `Node ${index + 1}`,
          lat: latitude,
          lng: longitude,
          type: node?.type || "rpc",
          region:
            node?.region || getRegionFromCoordinates(latitude, longitude),
        };
      })
      .filter(Boolean);
  }, [nodeMap, nodes]);

  const groupedNodes = useMemo(() => {
    const grouped = normalizedNodes.reduce((acc, node) => {
      const key = `${node.lat.toFixed(3)}:${node.lng.toFixed(3)}`;

      if (!acc[key]) {
        acc[key] = {
          ...node,
          count: 0,
          rpcList: [],
        };
      }

      acc[key].count += 1;
      acc[key].rpcList.push(node.rpc || node.name);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [normalizedNodes]);

  const regionRows = useMemo(() => {
    const counts = normalizedNodes.reduce((acc, node) => {
      const key = node.region || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const ordered = REGION_ORDER.filter((region) => counts[region]).map(
      (region) => [region, counts[region]],
    );
    const others = Object.entries(counts).filter(
      ([region]) => !REGION_ORDER.includes(region),
    );

    return [...ordered, ...others];
  }, [normalizedNodes]);

  const rpcCount = normalizedNodes.filter((node) => node.type === "rpc").length;
  const validatorCount = normalizedNodes.filter(
    (node) => node.type === "validator",
  ).length;

  const fitToNodes = useCallback(() => {
    if (!mapRef.current || !normalizedNodes.length) {
      return;
    }

    const map = mapRef.current.getMap();
    const lats = normalizedNodes.map((node) => node.lat);
    const lngs = normalizedNodes.map((node) => node.lng);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    if (minLng === maxLng && minLat === maxLat) {
      map.flyTo({
        center: [minLng, minLat],
        zoom: 4,
        duration: 0,
        essential: true,
      });
      return;
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 60, duration: 0, maxZoom: 4 },
    );
  }, [normalizedNodes]);

  useEffect(() => {
    dispatch.dashboard.handleGetNodeMap();
    const interval = setInterval(() => {
      dispatch.dashboard.handleGetNodeMap();
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    fitToNodes();
  }, [fitToNodes]);

  return (
    <div className="w-full">
      <div
        className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[12px]`}
      >
        <div
          className={`${isDarkTheme ? "border-b border-[#18212E]" : "border-b border-[#E2E8F0]"} p-[16px] flex justify-between items-center`}
        >
          <h1
            className={`flex items-center gap-[9.17px] text-[12px] ${isDarkTheme ? "text-white" : "text-[#000]"} leading-[16px] tracking-[0.6px] uppercase font-[700]`}
          >
            <img src={ASSETS.globalIcon} alt="Global icon" /> Global Network
            Distribution
          </h1>
          <div className="flex gap-[16.01px]">
            <p className="flex items-center gap-[6px] text-[#94A3B8] text-[10px] font-[700] leading-[15px] uppercase">
              <span className="inline-block bg-[#458FFF] w-[8px] h-[8px] rounded-full shrink-0" />
              RPC Nodes ({rpcCount})
            </p>
            <p className="flex items-center gap-[6px] text-[#94A3B8] text-[10px] font-[700] leading-[15px] uppercase">
              <span className="inline-block bg-[#7B78FF] w-[8px] h-[8px] rounded-full shrink-0" />
              Validators ({validatorCount})
            </p>
          </div>
        </div>

        <div className="relative h-[520px] w-full overflow-hidden rounded-b-[12px]">
          <Map
            ref={mapRef}
            initialViewState={{ longitude: 0, latitude: 20, zoom: 1.2 }}
            mapStyle={mapStyle}
            onLoad={fitToNodes}
            attributionControl={false}
            style={{ width: "100%", height: "100%" }}
          >
            <NavigationControl position="top-right" />
            {groupedNodes.map((node) => (
              <Marker
                key={node.id}
                latitude={node.lat}
                longitude={node.lng}
                anchor="center"
              >
                <div
                  title={`${node.count} node${node.count > 1 ? "s" : ""}${node.rpcList.length ? `\n${node.rpcList.join("\n")}` : ""}`}
                  className="relative flex items-center justify-center"
                >
                  <span className="absolute h-[34px] w-[34px] rounded-full bg-[#458FFF]/25" />
                  <span className="relative flex min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-[#458FFF] px-[7px] py-[4px] text-[10px] font-[700] leading-none text-white shadow-[0_4px_16px_rgba(69,143,255,0.45)]">
                    {node.count}
                  </span>
                </div>
              </Marker>
            ))}
          </Map>

          <div className="absolute bottom-[16px] right-[16px] bg-[#0D0D0DE6] border border-[#18212E] rounded-[8px] px-[12px] py-[10px] min-w-[140px]">
            {regionRows.length ? (
              regionRows.map(([region, count]) => (
                <div
                  key={region}
                  className="flex items-center justify-between gap-[14px] text-[10px] font-[700] leading-[16px] uppercase"
                >
                  <span className="text-[#7E8CA0]">{region}</span>
                  <span className="text-white">{count} Nodes</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-[700] uppercase text-[#7E8CA0]">
                No node data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalNetworkDistribution;
