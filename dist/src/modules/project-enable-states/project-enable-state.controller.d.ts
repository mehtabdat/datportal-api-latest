import { CreateProjectEnableStateDto } from './dto/create-project-enable-state.dto';
import { ProjectEnableStateService } from './project-enable-state.service';
import { ProjectEnableState } from './entities/project-enable-state.entity';
export declare class ProjectEnableStateController {
    private readonly projectEnableStateService;
    constructor(projectEnableStateService: ProjectEnableStateService);
    create(dto: CreateProjectEnableStateDto): Promise<ProjectEnableState>;
    getByProject(projectId: string): Promise<{
        id: number;
        pId: number;
        pstateId: number;
    }[]>;
}
