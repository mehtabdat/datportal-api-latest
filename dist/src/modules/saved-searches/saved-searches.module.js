"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedSearchesModule = void 0;
const common_1 = require("@nestjs/common");
const saved_searches_service_1 = require("./saved-searches.service");
const saved_searches_controller_1 = require("./saved-searches.controller");
const authorization_service_1 = require("../../authorization/authorization.service");
let SavedSearchesModule = class SavedSearchesModule {
};
SavedSearchesModule = __decorate([
    (0, common_1.Module)({
        controllers: [saved_searches_controller_1.SavedSearchesController],
        providers: [saved_searches_service_1.SavedSearchesService, authorization_service_1.AuthorizationService]
    })
], SavedSearchesModule);
exports.SavedSearchesModule = SavedSearchesModule;
//# sourceMappingURL=saved-searches.module.js.map