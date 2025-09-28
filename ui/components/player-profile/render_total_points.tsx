import { IAction, ProfileMatch } from "interfaces/player_profile_type";
import { cx } from "class-variance-authority";
// Render stats based on selected action
const renderTotalPoints = (
  action: string,
  data: ProfileMatch[],
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

  const totalPoints = data.reduce((sum, d) => {
    const actionData = d[matchKey] as IAction;
    return sum + (actionData?.success || 0);
  }, 0);

  return (
    <div
      className={cx(
        "flex w-full",
        isMobile ? "items-center pl-4 pr-4" : "justify-end gap-2 flex-shrink-0"
      )}
    >
      {/* Label */}
      <span
        className={cx(
          "text-white text-[18px] whitespace-nowrap",
          isMobile && "mr-auto" // push it fully left on mobile
        )}
      >
        {t(`PlayerProfile.totalScoreLabel.${labelKey}`)}
      </span>

      {/* Score + Unit */}
      <div className="flex items-baseline gap-1">
        <span className="text-white text-[40px] font-bold italic relative -top-1">
          {totalPoints}
        </span>
        <span className="text-white text-[16px]">{unitKey}</span>
      </div>
    </div>
  );
};

export default renderTotalPoints;
