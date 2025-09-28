export const getTeamLogo = (teamName: string | undefined) => {
    const teamLogoMap: Record<string, string> = {
        "臺中連莊": "/assets/logo-taichung.png",
        "桃園雲豹飛將": "/assets/logo-taoyuan.png",
        "台鋼天鷹": "/assets/logo-sky.png",
        "臺北伊斯特": "/assets/logo-taipei.png",
    };

    return teamLogoMap[teamName || ""];
};