"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinatesService = void 0;
const common_1 = require("@nestjs/common");
let CoordinatesService = class CoordinatesService {
    constructor() {
        this.predefinedCoordinates = [
            { latitude: 25.188737, longitude: 55.2671323 },
            { latitude: 24.499101, longitude: 54.403901 },
            { latitude: 25.1859260, longitude: 55.2761674 },
        ];
    }
    validateProximity(userLatitude, userLongitude) {
        const proximityThreshold = 0.08;
        for (const predefinedCoord of this.predefinedCoordinates) {
            if (this.calculateHaversineDistance(userLatitude, userLongitude, predefinedCoord.latitude, predefinedCoord.longitude) <= proximityThreshold) {
                return true;
            }
        }
        return false;
    }
    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.abs(distance);
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
};
CoordinatesService = __decorate([
    (0, common_1.Injectable)()
], CoordinatesService);
exports.CoordinatesService = CoordinatesService;
//# sourceMappingURL=coordinates.service.js.map