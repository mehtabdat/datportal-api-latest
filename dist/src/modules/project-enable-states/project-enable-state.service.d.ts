import { Repository } from 'typeorm';
import { ProjectEnableState } from '../project-enable-states/entities/project-enable-state.entity';
import { CreateProjectEnableStateDto } from './dto/create-project-enable-state.dto';
import { PrismaService } from '../../prisma.service';
export declare class ProjectEnableStateService {
    private readonly projectEnableStateRepository;
    private readonly prisma;
    constructor(projectEnableStateRepository: Repository<ProjectEnableState>, prisma: PrismaService);
    create(dto: CreateProjectEnableStateDto): Promise<ProjectEnableState>;
    findByProjectId(projectId: string): Promise<{
        id: number;
        pId: number;
        pstateId: number;
    }[]>;
}
