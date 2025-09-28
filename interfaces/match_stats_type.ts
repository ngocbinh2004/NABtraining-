import IStats from "./stats_type";

interface IRoundSummaryRotation {
  position: number;
  isStarting?: boolean;
  switchedRosterId?: number;
  startingRosterId?: number;
  replacedRosterId?: number;
}

interface IRoundSummaryTimeoutScoreRecord {
  timeoutAt: string;
  ownScore: number;
  opposingScore: number;
}

interface IRoundSummaryRotations {
  rotations?: IRoundSummaryRotation[];
  rotation?: IRoundSummaryRotation;
  liberoIds?: number[];
  timeoutScoreRecords?: IRoundSummaryTimeoutScoreRecord[];
}

interface IRound extends IStats {
  matchId: number;
  squadId: number;
  rosterId: number;

  roundCount?: number; //rosters level
  round?: number; //rounds level
  score?: number;

  summary: IRoundSummaryRotations;

  isWon?: boolean;
  wonScore?: number;
  lostScore?: number;
  substitutions?: number;
  opponentErrors?: number;
  timeouts?: number;
}

export interface IRoster extends IStats {
  matchId: number;
  squadId: number;
  rosterId: number;
  roundCount: number;
  score: number;
  rounds: IRound[];
}

export interface ISquad extends IStats {
  matchId: number;
  squadId: number;
  roundCount: number;

  wonRoundCount: number;
  lostRoundCount: number;
  drawRoundCount: number;

  wonScore: number;
  lostScore: number;

  substitutions: number;
  opponentErrors: number;
  timeouts: number;

  rounds: IRound[];
}

export default interface IMatchStats {
  matchId: number;
  rosters: IRoster[];
  squads: ISquad[];
}