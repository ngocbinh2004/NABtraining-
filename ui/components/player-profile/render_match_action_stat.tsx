import {
  IAction,
  PlayerData,
  ProfileMatch,
} from "interfaces/player_profile_type";

// Render stats based on selected action
const renderMatchActionStat = (
  action: string,
  data: ProfileMatch,
  t: (key: string) => string,
  isMobile: boolean
) => {
  // Map value to ProfileMatch's key
  const mapValueToKey: Record<string, keyof ProfileMatch> = {
    attackPoints: "attack",
    blockPoints: "block",
    servePoints: "serve",
    passes: "pass",
    defenses: "defense",
    sets: "set",
  };

  const matchKey = mapValueToKey[action];
  if (!matchKey) return null;

  const labelKey = matchKey.toString();

  const unitKey = action.includes("Points")
    ? t("PlayerProfile.pointsUnit")
    : t("PlayerProfile.timesUnit");

  const matchData = (data as ProfileMatch)[matchKey] as IAction;
  return isMobile ? (
    <>
      {/* MobileLayout */}
      {/* attempt */}
      <div className="grid grid-cols-2 gap-4 max-w-full mt-1 text-white">
        <div className="flex flex-col items-center">
          <span className="text-[16px] whitespace-nowrap">
            {t(`PlayerProfile.actionLabel.${labelKey}`)}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[32px] font-bold italic">
              {matchData.success}/{matchData.attackTotal}
            </span>
            <span className="text-[16px] relative top-[7px]">{unitKey}</span>
          </div>
        </div>

        {/* success rate */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-[16px] whitespace-nowrap">
            {t("PlayerProfile.successRateLabel")}
          </span>
          <div>
            <span className="text-[32px] font-bold italic">
              {matchData.successRate}
            </span>
            <span className="text-[16px]"> %</span>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      {/* DestopLayout */}
      {/* attempt */}
      <div className="flex flex-row justify-around gap-6 max-w-full gap-y-4 text-white">
        <div className="flex items-center gap-1">
          <span className="text-[16px] lg:text-[18px]">
            {t(`PlayerProfile.actionLabel.${labelKey}`)}
          </span>
          <span className="text-[32px] lg:text-[40px] font-bold italic relative lg:-mt-1 lg:-top-2 -top-1">
            {matchData.success}/{matchData.attackTotal}
          </span>
          <span className="text-[16px]">{unitKey}</span>
        </div>

        {/* success rate */}
        <div className="flex items-center gap-1">
          <span className="text-[16px] lg:text-[18px]">
            {t("PlayerProfile.successRateLabel")}
          </span>
          <span className="text-[32px] lg:text-[40px] font-bold italic relative lg:-mt-1 lg:-top-2 -top-1">
            {matchData.successRate}
          </span>
          <span className="text-[16px]">%</span>
        </div>
      </div>
    </>
  );
};

export default renderMatchActionStat;
