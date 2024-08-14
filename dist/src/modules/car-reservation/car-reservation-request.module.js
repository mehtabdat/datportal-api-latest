"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarReservationModule = void 0;
const common_1 = require("@nestjs/common");
const car_reservation_request_service_1 = require("./car-reservation-request.service");
const car_reservation_request_controller_1 = require("./car-reservation-request.controller");
const car_reservation_request_authorization_service_1 = require("./car-reservation-request.authorization.service");
let CarReservationModule = class CarReservationModule {
};
CarReservationModule = __decorate([
    (0, common_1.Module)({
        controllers: [car_reservation_request_controller_1.CarReservationRequestController],
        providers: [car_reservation_request_service_1.CarReservationRequestService, car_reservation_request_authorization_service_1.CarReservationAuthorizationService]
    })
], CarReservationModule);
exports.CarReservationModule = CarReservationModule;
//# sourceMappingURL=car-reservation-request.module.js.map