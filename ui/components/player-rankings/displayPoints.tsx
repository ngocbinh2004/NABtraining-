import { TFunction } from "i18next";

const renderPointsComponent = (value: string, label: string) => (
  <div className="flex items-end gap-2">
    <span className="text-[40px] font-bold italic leading-none">{value}</span>
    <span className="text-[18px] relative top-1">{label}</span>
  </div>
);

const displayPoints = (selectedTitle: string, player: any, t: TFunction) => {
  switch (selectedTitle) {
    case "outside_hitter": {
      const value = (player?.stats?.spikes ?? 0).toString();
      const label = t("PlayerRankingPage.number_of_times");
      return renderPointsComponent(value, label);
    }
    case "middle_blocker": {
      const value = (player?.stats?.completedBlocks ?? "0").toString();
      const label = t("PlayerRankingPage.points");
      return renderPointsComponent(value, label);
    }
    case "setter": {
      const value = (player?.stats?.sets ?? "0").toString();
      const label = t("PlayerRankingPage.number_of_times");
      return renderPointsComponent(value, label);
    }
    case "opposite_hitter": {
      const total = (player?.stats?.spikes ?? 0) + (player?.stats?.blocks ?? 0);
      const value = total.toString();
      const label = t("PlayerRankingPage.points");
      return renderPointsComponent(value, label);
    }
    case "libero": {
      const total =
        (player?.stats?.passes ?? 0) + (player?.stats?.defenses ?? 0);
      const value = total.toString();
      const label = t("PlayerRankingPage.number_of_times");
      return renderPointsComponent(value, label);
    }
    case "top_scorer": {
      const value = (player?.stats?.score ?? 0).toString();
      const label = t("PlayerRankingPage.points");
      return renderPointsComponent(value, label);
    }
  }
};

export default displayPoints;