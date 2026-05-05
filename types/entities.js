/**
 * @typedef {'farmer' | 'driver'} UserRole
 */

/**
 * @typedef {'normal' | 'urgent' | 'perishable'} Urgency
 */

/**
 * @typedef {'pending' | 'matched' | 'accepted' | 'en_route' | 'completed' | 'cancelled'} RequestStatus
 */

/**
 * @typedef {Object} GeoPoint
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} AppUser
 * @property {string} id
 * @property {UserRole} role
 * @property {string} name
 * @property {string} phone
 * @property {number} [createdAt]
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} driverId
 * @property {'tractor' | 'truck'} type
 * @property {number} capacityKg
 * @property {boolean} availability
 * @property {GeoPoint} currentLocation
 * @property {number} [heading]
 * @property {number} [updatedAt]
 */

/**
 * @typedef {Object} PlaceRef
 * @property {string} label
 * @property {GeoPoint} coords
 */

/**
 * @typedef {Object} TransportRequest
 * @property {string} id
 * @property {string} farmerId
 * @property {string} cropType
 * @property {number} quantity
 * @property {PlaceRef} pickup
 * @property {PlaceRef} destination
 * @property {Urgency} urgency
 * @property {RequestStatus} status
 * @property {string} [assignedVehicleId]
 * @property {string} [assignedDriverId]
 * @property {string} [routePolyline]
 * @property {number} [estimatedCost]
 * @property {number} [etaMinutes]
 * @property {number} createdAt
 */

export {};
