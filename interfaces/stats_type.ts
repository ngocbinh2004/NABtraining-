export interface IMetric {
    errorPercentage: number;
    successPercentage: number;
    perSet: number;
}

export default interface IStats {
    spikes: number;
    attemptSpikes: number;
    errorSpikes: number;
    completedSpikes: number;
    spikesMetrics: IMetric;

    serves: number;
    attemptServes: number;
    errorServes: number;
    completedServes: number;
    servesMetrics: IMetric;

    blocks: number;
    attemptBlocks: number;
    errorBlocks: number;
    completedBlocks: number;
    blocksMetrics: IMetric;

    defenses: number;
    attemptDefenses: number;
    errorDefenses: number;
    completedDefenses: number;
    defensesMetrics: IMetric;

    passes: number;
    attemptPasses: number;
    errorPasses: number;
    completedPasses: number;
    passesMetrics: IMetric;

    sets: number;
    attemptSets: number;
    errorSets: number;
    completedSets: number;
    setsMetrics: IMetric;

    fouls: number;
}