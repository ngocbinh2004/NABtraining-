import IStats from "./stats_type";

export default interface IEventRosterStatistics extends IStats {
  squadId: number;
  rosterId: number;
  matchCount: number;
  roundCount: number;
  score: number;
}