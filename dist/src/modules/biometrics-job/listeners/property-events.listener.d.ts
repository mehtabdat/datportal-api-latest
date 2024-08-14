import { Queue } from 'bull';
import { BiometricsJobProcessEvent } from '../dto/biometrics-jobs.dto';
export declare class BiometricsJobEventListener {
    private propertyQueue;
    constructor(propertyQueue: Queue);
    handleBiometricsJobProcessEvent(event: BiometricsJobProcessEvent): Promise<void>;
}
