import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from 'src/authentication/token.service';
import { Project, ProjectConversation } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly tokenService;
    private prisma;
    private clients;
    private readonly logger;
    server: Server;
    constructor(tokenService: TokenService, prisma: PrismaService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): void;
    private getClientIpAddress;
    sendMessage(message: ProjectConversation & {
        Project: Partial<Project>;
    }, senderId: number): Promise<void>;
    findSocketByClientId(clientId: string): Socket | undefined;
}
