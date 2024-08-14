"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const token_service_1 = require("../../authentication/token.service");
const prisma_service_1 = require("../../prisma.service");
const constants_1 = require("../../config/constants");
const project_permissions_1 = require("../project/project.permissions");
const BluebirdPromise = require("bluebird");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(tokenService, prisma) {
        this.tokenService = tokenService;
        this.prisma = prisma;
        this.clients = [];
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleConnection(client, ...args) {
        try {
            const authorizationHeader = client.handshake.headers['authorization'];
            if (!authorizationHeader) {
                throw { message: "No Authenticattion Token Found, closing the connection" };
            }
            const user = await this.tokenService.verifyUserToken(authorizationHeader, true);
            if (!user) {
                throw { message: "Invalid Authkey, No User Found" };
            }
            const userAgent = client.handshake.headers['user-agent'];
            const ipAddress = this.getClientIpAddress(client.handshake.address);
            const clientIdentifier = `${userAgent}-${ipAddress}-${user.userId}`;
            this.logger.log(`User: ${user.userId} connected, Client: ${client.id}`);
            this.clients.push({ clientId: client.id, userId: user.userId, key: clientIdentifier });
        }
        catch (err) {
            this.logger.error("Error while establishing a connection to websocket user, ", err.message);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        let disconnectingClient = this.clients.find((c) => c.clientId !== client.id);
        this.clients = this.clients.filter((c) => c.clientId !== client.id);
        this.logger.log(`Client ${client.id} Disconnected - User: ${disconnectingClient === null || disconnectingClient === void 0 ? void 0 : disconnectingClient.userId}`);
    }
    getClientIpAddress(ipAddress) {
        if (Array.isArray(ipAddress)) {
            return ipAddress[0];
        }
        return ipAddress;
    }
    async sendMessage(message, senderId) {
        let allUsers = await this.prisma.user.findMany({
            where: {
                status: constants_1.UserStatus.active,
                AND: {
                    OR: [
                        {
                            ProjectMembers: {
                                some: {
                                    projectId: message.projectId
                                }
                            }
                        },
                        {
                            userRole: {
                                some: {
                                    OR: [
                                        {
                                            Role: {
                                                RolePermissions: {
                                                    some: {
                                                        Permission: {
                                                            action: project_permissions_1.ProjectPermissionSet.REAL_ALL_PROJECT
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            Role: {
                                                slug: constants_1.SUPER_ADMIN
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        });
        this.logger.log(`Found ${allUsers.length} subscribers for the project`);
        if (allUsers && allUsers.length > 0) {
            const MAX_CONCURRENT_OPERATIONS = 10;
            await BluebirdPromise.map(allUsers, async (ele) => {
                let unreadMessageCount = await this.prisma.projectConversation.count({
                    where: {
                        projectId: message.projectId,
                        userId: {
                            not: ele.id
                        },
                        AND: {
                            OR: [
                                {
                                    ReadLog: {
                                        some: {
                                            userId: ele.id,
                                            read: false
                                        }
                                    }
                                },
                                {
                                    ReadLog: {
                                        none: {
                                            userId: ele.id
                                        }
                                    }
                                }
                            ]
                        }
                    }
                });
                const connectedClient = [];
                this.clients.forEach(clientData => {
                    if (clientData.userId === ele.id) {
                        connectedClient.push(clientData);
                    }
                });
                if (connectedClient.length === 0)
                    return;
                connectedClient.forEach((eachConnectedClient) => {
                    const socket = this.findSocketByClientId(eachConnectedClient.clientId);
                    if (socket) {
                        try {
                            socket.emit('chat', Object.assign(Object.assign({}, message), { unreadConversationCount: unreadMessageCount }));
                            this.logger.log(`Sent message to UserId: ${eachConnectedClient.userId}`);
                        }
                        catch (err) {
                            this.logger.error("Some error while emitting message", err.message);
                        }
                    }
                });
            }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        }
    }
    findSocketByClientId(clientId) {
        const sockets = this.server.sockets.sockets;
        for (const [id, socket] of sockets) {
            if (id === clientId) {
                return socket;
            }
        }
        return undefined;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [token_service_1.TokenService, prisma_service_1.PrismaService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map