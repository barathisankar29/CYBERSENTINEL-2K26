import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  campusLocationData,
  landmarkHubsData,
  chennaiTransitStopsData,
  type LandmarkTransitHub,
  type TransitStopPoint,
} from '@/data/transportation'
import './TacticalMapHud.css'

type CorridorFilter = 'ALL' | 'AVADI'

export function TacticalMapHud() {
  const [selectedFilter, setSelectedFilter] = useState<CorridorFilter>('ALL')
  const [selectedStop, setSelectedStop] = useState<TransitStopPoint | null>(null)
  const [selectedHub, setSelectedHub] = useState<LandmarkTransitHub | null>(null)
  const [addressCopied, setAddressCopied] = useState<boolean>(false)

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const stopMarkersRef = useRef<Record<string, L.Marker>>({})
  const campusMarkerRef = useRef<L.Marker | null>(null)

  // Filtered stops based on active corridor filter
  const filteredStops = useMemo(() => {
    if (selectedFilter === 'ALL') return chennaiTransitStopsData
    return chennaiTransitStopsData.filter((s) => s.hubGroup === 'AVADI')
  }, [selectedFilter])

  // Copy Address Handler
  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(campusLocationData.address).then(() => {
      setAddressCopied(true)
      setTimeout(() => setAddressCopied(false), 2400)
    })
  }, [])

  // Initialize Leaflet Map once — StrictMode-safe
  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return
    if (leafletMapRef.current) return

    // Clean stale _leaflet_id left by a previous mount (React StrictMode double-invoke)
    type LeafletContainer = HTMLDivElement & { _leaflet_id?: number }
    const leafletContainer = container as LeafletContainer
    if (leafletContainer._leaflet_id) {
      delete leafletContainer._leaflet_id
    }

    // Center of Chennai Metropolitan Region showing full satellite view
    const initialCenter: [number, number] = [13.09, 80.14]

    const map = L.map(container, {
      center: initialCenter,
      zoom: 10.4,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false, // We supply custom HUD zoom controls
      attributionControl: false,
    })

    // 1. Esri World Imagery (Satellite Layer)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        className: 'cyber-satellite-tiles',
      }
    ).addTo(map)

    // 2. Esri World Boundaries & Places Overlay (District borders and city names)
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        className: 'cyber-boundary-tiles',
      }
    ).addTo(map)

    // Custom attribution badge
    L.control
      .attribution({
        position: 'bottomright',
        prefix:
          '<span class="tactical-attr">CYBERSENTINEL SATELLITE MATRIX // ESRI &copy; OSM</span>',
      })
      .addTo(map)

    // 3. College Campus Center Beacon Marker (Prominent Cyber Command Target)
    const campusCoords: [number, number] = [
      campusLocationData.latitude,
      campusLocationData.longitude,
    ]

    const campusBeaconIcon = L.divIcon({
      className: 'college-center-marker-wrap',
      html: `
        <div class="college-center-marker">
          <div class="college-center-sonar college-center-sonar--1"></div>
          <div class="college-center-sonar college-center-sonar--2"></div>
          <div class="college-center-reticle">
            <span class="reticle-axis reticle-axis--h"></span>
            <span class="reticle-axis reticle-axis--v"></span>
            <div class="college-center-core">
              <span class="college-center-cross">✕</span>
            </div>
          </div>
          <div class="college-center-label">
            <span class="label-beacon-dot"></span>
            <span class="label-text">VEL TECH HIGH TECH</span>
          </div>
        </div>
      `,
      iconSize: [68, 68],
      iconAnchor: [34, 34],
    })

    const campusMarker = L.marker(campusCoords, {
      icon: campusBeaconIcon,
      zIndexOffset: 2000,
    }).addTo(map)

    campusMarker.bindPopup(
      `
      <div class="tactical-popup tactical-popup--campus">
        <div class="tactical-popup__header">
          <span class="tactical-popup__badge">TARGET DESTINATION</span>
          <span class="tactical-popup__code">CAMPUS SEC-01</span>
        </div>
        <h4 class="tactical-popup__title">${campusLocationData.name}</h4>
        <p class="tactical-popup__addr">${campusLocationData.address}</p>
        <div class="tactical-popup__meta">
          <span>GPS: ${campusLocationData.coordinatesDisplay}</span>
        </div>
        <a href="${campusLocationData.googleMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" class="tactical-popup__link">
          GET DIRECTIONS TO CAMPUS ↗
        </a>
      </div>
    `,
      {
        className: 'tactical-popup-container',
        offset: [0, -28],
      }
    )

    campusMarkerRef.current = campusMarker

    // Create a LayerGroup for dynamic transit stop pins
    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer

    leafletMapRef.current = map

    return () => {
      map.remove()
      leafletMapRef.current = null
      markersLayerRef.current = null
      campusMarkerRef.current = null
      stopMarkersRef.current = {}
      // Clear Leaflet container stamp so StrictMode remount can reinitialize cleanly
      const lc = container as LeafletContainer
      if (lc._leaflet_id) delete lc._leaflet_id
    }
  }, [])

  // Update Transit Stop Pins whenever filter changes
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return
    const layer = markersLayerRef.current
    layer.clearLayers()
    stopMarkersRef.current = {}

    filteredStops.forEach((stop) => {
      // Custom Cyberpunk Transit Node Pin (Replacing the anchor design)
      const stopIcon = L.divIcon({
        className: 'cyber-stop-marker-wrap',
        html: `
          <div class="cyber-stop-node cyber-stop-node--${stop.accentColor}" title="${stop.name}">
            <div class="stop-node-glow"></div>
            <div class="stop-node-badge">
              <svg class="stop-node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="3" width="16" height="15" rx="3"></rect>
                <path d="M4 10h16"></path>
                <path d="M8 6h.01"></path>
                <path d="M16 6h.01"></path>
                <path d="M6 18l-1.5 2.5"></path>
                <path d="M18 18l1.5 2.5"></path>
                <circle cx="8" cy="14" r="1.5" fill="currentColor"></circle>
                <circle cx="16" cy="14" r="1.5" fill="currentColor"></circle>
              </svg>
            </div>
            <span class="stop-node-ping"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker(stop.coordinates, {
        icon: stopIcon,
        zIndexOffset: 600,
      })

      marker.bindPopup(
        `
        <div class="tactical-popup tactical-popup--${stop.accentColor}">
          <div class="tactical-popup__header">
            <span class="tactical-popup__badge">${stop.corridor}</span>
            <span class="tactical-popup__code">${stop.distanceFromCampus}</span>
          </div>
          <h4 class="tactical-popup__title">${stop.name}</h4>
          <p class="tactical-popup__addr">Zone: ${stop.zone} • ${stop.landmarkInfo || 'Direct Connected Route'}</p>
          <div class="tactical-popup__meta">
            <span>Coordinates: ${stop.coordinates[0].toFixed(4)}° N, ${stop.coordinates[1].toFixed(4)}° E</span>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&origin=${stop.coordinates[0]},${stop.coordinates[1]}&destination=${campusLocationData.latitude},${campusLocationData.longitude}" target="_blank" rel="noopener noreferrer" class="tactical-popup__link">
            TRANSIT TO VEL TECH ↗
          </a>
        </div>
      `,
        {
          className: 'tactical-popup-container',
          offset: [0, -18],
        }
      )

      marker.on('click', () => {
        setSelectedStop(stop)
      })

      marker.addTo(layer)
      stopMarkersRef.current[stop.id] = marker
    })
  }, [filteredStops])

  // Zoom Handlers
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut()
    }
  }

  // Focus Campus Target Lock
  const handleResetTarget = () => {
    setSelectedStop(null)
    setSelectedHub(null)
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo(
        [campusLocationData.latitude, campusLocationData.longitude],
        14,
        { duration: 1.2 }
      )
      if (campusMarkerRef.current) {
        campusMarkerRef.current.openPopup()
      }
    }
  }

  // Focus Overview of Chennai Region
  const handleFocusOverview = () => {
    setSelectedStop(null)
    setSelectedHub(null)
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([13.09, 80.14], 10.4, { duration: 1.2 })
    }
  }

  // Focus specific Transit Hub from cards below
  const handleSelectHub = (hub: LandmarkTransitHub) => {
    setSelectedHub(hub)
    if (leafletMapRef.current) {
      const bounds = L.latLngBounds([
        hub.coordinates,
        [campusLocationData.latitude, campusLocationData.longitude],
      ])
      leafletMapRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 13.5,
      })

      // Try opening matching stop marker
      const matchingStop = chennaiTransitStopsData.find((s) =>
        s.name.toLowerCase().includes(hub.name.split(' ')[0].toLowerCase())
      )
      if (matchingStop && stopMarkersRef.current[matchingStop.id]) {
        stopMarkersRef.current[matchingStop.id].openPopup()
        setSelectedStop(matchingStop)
      }
    }
  }

  return (
    <div className="tactical-map-hud" id="tactical-map">
      {/* Top Console Ribbon */}
      <div className="tactical-map-hud__console-bar">
        {/* Corridor Filter Pills: Exactly 2 options */}
        <div className="tactical-corridor-filters">
          <button
            type="button"
            className={`tactical-filter-pill ${selectedFilter === 'ALL' ? 'tactical-filter-pill--active' : ''}`}
            onClick={() => setSelectedFilter('ALL')}
          >
            ALL STOPS ({chennaiTransitStopsData.length})
          </button>
          <button
            type="button"
            className={`tactical-filter-pill tactical-filter-pill--magenta ${selectedFilter === 'AVADI' ? 'tactical-filter-pill--active' : ''}`}
            onClick={() => setSelectedFilter('AVADI')}
          >
            AVADI (COLLEGE &amp; MTC BUSES)
          </button>
        </div>
      </div>

      {/* Main Map Viewport Chassis */}
      <div className="tactical-map-hud__viewport-container">
        {/* Leaflet Satellite Map Container — must be first so Leaflet gets the full container */}
        <div
          ref={mapContainerRef}
          className="tactical-satellite-map"
          id="chennai-satellite-map"
        />

        {/* Tactical Corner HUD Reticles */}
        <div className="tactical-corner tactical-corner--tl" aria-hidden="true" />
        <div className="tactical-corner tactical-corner--tr" aria-hidden="true" />
        <div className="tactical-corner tactical-corner--bl" aria-hidden="true" />
        <div className="tactical-corner tactical-corner--br" aria-hidden="true" />

        {/* Top Floating Target Campus Info Card */}
        <div className="tactical-floating-info">
          <div className="tactical-floating-info__tag">
            <span className="info-pulse-dot" />
            CAMPUS HEADQUARTERS // TARGET DESTINATION
          </div>
          <h4 className="tactical-floating-info__title">{campusLocationData.name}</h4>
          <p className="tactical-floating-info__addr">{campusLocationData.address}</p>
          <div className="tactical-floating-info__coords">
            GPS: {campusLocationData.coordinatesDisplay}
          </div>
        </div>

        {/* In-Map Floating HUD Controls */}
        <div className="tactical-hud-controls">
          <button
            type="button"
            className="tactical-hud-btn"
            onClick={handleZoomIn}
            title="Satellite Zoom In"
            aria-label="Satellite Zoom In"
          >
            +
          </button>
          <button
            type="button"
            className="tactical-hud-btn"
            onClick={handleZoomOut}
            title="Satellite Zoom Out"
            aria-label="Satellite Zoom Out"
          >
            −
          </button>
          <div className="tactical-hud-btn-divider" />
          <button
            type="button"
            className="tactical-hud-btn tactical-hud-btn--target"
            onClick={handleResetTarget}
            title="Lock Campus Target"
            aria-label="Lock Campus Target"
          >
            🎯
          </button>
          <button
            type="button"
            className="tactical-hud-btn tactical-hud-btn--overview"
            onClick={handleFocusOverview}
            title="Overview Chennai Region"
            aria-label="Overview Chennai Region"
          >
            🌐
          </button>
        </div>

        {/* Selected Stop Telemetry HUD Pill */}
        {selectedStop && (
          <div className="tactical-selected-stop-hud">
            <span className={`selected-stop-dot selected-stop-dot--${selectedStop.accentColor}`} />
            <div className="selected-stop-meta">
              <span className="selected-stop-tag">ACTIVE NODE:</span>
              <span className="selected-stop-name">{selectedStop.name}</span>
              <span className="selected-stop-dist">({selectedStop.distanceFromCampus} to Campus)</span>
            </div>
            <button
              type="button"
              className="selected-stop-dismiss"
              onClick={() => setSelectedStop(null)}
              aria-label="Dismiss stop selection"
            >
              ✕
            </button>
          </div>
        )}

        {/* Bottom Quick Control Overlay */}
        <div className="tactical-map-hud__bottom-bar">
          <a
            href={campusLocationData.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tactical-action-btn tactical-action-btn--primary"
          >
            <span className="tactical-action-btn__icon">🧭</span>
            <span>GET TURN-BY-TURN DIRECTIONS</span>
            <span className="tactical-action-btn__arrow">↗</span>
          </a>

          <button
            type="button"
            className="tactical-action-btn tactical-action-btn--secondary"
            onClick={handleCopyAddress}
          >
            {addressCopied ? (
              <>
                <span className="tactical-action-btn__icon">✓</span>
                <span>ADDRESS COPIED</span>
              </>
            ) : (
              <>
                <span className="tactical-action-btn__icon">📋</span>
                <span>COPY ADDRESS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Regional Transit Hubs Distance Matrix */}
      <div className="tactical-landmarks">
        <div className="tactical-landmarks__header">
          <span className="tactical-landmarks__indicator" />
          <span className="tactical-landmarks__title">
            REGIONAL TRANSIT HUBS // DISTANCE MATRIX
          </span>
          <span className="tactical-landmarks__hint">
            CLICK A HUB TO ZOOM &amp; HIGHLIGHT ON MAP
          </span>
        </div>

        <div className="tactical-landmarks__grid">
          {landmarkHubsData.map((hub) => {
            const isSelected = selectedHub?.id === hub.id

            return (
              <div
                key={hub.id}
                className={`tactical-hub-card tactical-hub-card--${hub.accentColor} ${isSelected ? 'tactical-hub-card--selected' : ''}`}
                onClick={() => handleSelectHub(hub)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectHub(hub)
                  }
                }}
              >
                <div className="tactical-hub-card__top">
                  <span className="tactical-hub-card__icon">{hub.icon}</span>
                  <span className="tactical-hub-card__distance">{hub.distance}</span>
                </div>
                <h5 className="tactical-hub-card__name">{hub.name}</h5>
                <div className="tactical-hub-card__time">
                  <span className="tactical-hub-card__time-icon">⏱️</span>
                  <span>Est. {hub.estTime}</span>
                </div>
                <p className="tactical-hub-card__mode">{hub.transitMode}</p>
                <div className="tactical-hub-card__footer">
                  <span className="tactical-hub-card__sector">{hub.sectorCode}</span>
                  <span className="tactical-hub-card__action">FOCUS MAP ↗</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

