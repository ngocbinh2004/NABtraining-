import { beautifyMatchDate } from 'helpers/beautifyDate'
import { getTeamName } from 'helpers/getTeamName'
import { IMatches } from 'interfaces/match_type'
import { useMemo, Fragment } from 'react'

interface IProps {
  matchData?: IMatches[]
}

function MatchSetScore({ matchData }: IProps) {
  const matchDataFilledToMaxRound = useMemo(() => {
    const matchLength =
      matchData && matchData?.length > 0
        ? matchData
            .filter((match) => !!match)
            .map(({ match_set: sets }) => sets?.length || 0)
        : [0]
    const maxSetRound = Math.max(...matchLength)
    return matchData && matchData?.length > 0
      ? matchData
          .filter((match) => !!match)
          .map((match: IMatches) => {
            const { match_set: sets, ...rest } = match

            const setRound = sets?.length
            if (!setRound) return

            const completeSets = [...sets]
            if (setRound < maxSetRound) {
              const delta = maxSetRound - setRound
              for (let i = 1; i <= delta; i++) {
                const round = i + setRound
                completeSets.push({
                  no: round,
                  id: round,
                  name: '',
                  match_id: round,
                  create_dt: new Date(),
                  updated_dt: new Date(),
                  team1_id: 0,
                  team2_id: 0,
                  team1_score: 0,
                  team2_score: 0,
                  loser_team_id: 0,
                })
              }
            }
            return {
              ...rest,
              match_set: [...completeSets],
            } as IMatches
          })
      : []
  }, [matchData])

  if (
    !matchDataFilledToMaxRound ||
    !matchDataFilledToMaxRound?.[0]?.match_set?.length
  ) {
    return null
  }
  return (
    <div className="wl-table-match-set-score">
      {/* START: TABLE DESKTOP */}
      <div className="wl-table-match-set-score--is-desktop">
        {/* START: header */}
        <div className="header">Date</div>
        <div className="header">Team</div>
        <div className="header round">
          {matchDataFilledToMaxRound &&
            matchDataFilledToMaxRound?.[0] &&
            matchDataFilledToMaxRound?.[0]?.match_set &&
            matchDataFilledToMaxRound?.[0]?.match_set?.length > 0 &&
            matchDataFilledToMaxRound?.[0]?.match_set?.map(({ no }) => (
              <div key={`header-match-${no}`}>{`R${no}`}</div>
            ))}
        </div>
        <div className="header">Win</div>
        {/* END: header */}

        {/* START: body */}
        {matchDataFilledToMaxRound.map((match?: IMatches) => {
          if (!match) return null

          const team1 = getTeamName({
            abbreviation: match?.team1?.abbreviation,
            name: match?.team1?.name,
          })
          const team2 = getTeamName({
            abbreviation: match?.team2?.abbreviation,
            name: match?.team2?.name,
          })

          return (
            <Fragment key={match.id}>
              <div className="body date bg-black text-white">
                {beautifyMatchDate(match.start_date ?? '')
                  .split(';')
                  .map((text, index) => (
                    <Fragment key={index}>
                      {text}
                      <br />
                    </Fragment>
                  ))}
              </div>
              {/* START: body team1 */}
              <div className="body odd">{team1}</div>
              <div className="body round odd">
                {match?.match_set &&
                  match?.match_set?.length > 0 &&
                  match?.match_set?.map(({ team1_score, name, no }) => (
                    <div key={`team1-${no}`}>{name ? team1_score : '-'}</div>
                  ))}
              </div>
              <div className="body odd">{match?.team1_win}</div>
              {/* END: body team1 */}
              {/* START: body team2 */}
              <div className="body even">{team2}</div>
              <div className="body round even">
                {match?.match_set &&
                  match?.match_set?.length > 0 &&
                  match?.match_set?.map(({ team2_score, name, no }) => (
                    <div key={`team2-${no}`}>{name ? team2_score : '-'}</div>
                  ))}
              </div>
              <div className="body even">{match?.team2_win}</div>
              {/* END: body team2 */}
            </Fragment>
          )
        })}
        {/* END: body */}
      </div>
      {/* END: TABLE DESKTOP */}

      {/* START: TABLE MOBILE */}
      <div className="wl-table-match-set-score--is-mobile">
        {matchDataFilledToMaxRound &&
          matchDataFilledToMaxRound?.length > 0 &&
          matchDataFilledToMaxRound.map((match?: IMatches) => {
            if (!match) return null

            const team1 = getTeamName({
              abbreviation: match?.team1?.abbreviation,
              name: match?.team1?.name,
            })
            const team2 = getTeamName({
              abbreviation: match?.team2?.abbreviation,
              name: match?.team2?.name,
            })

            return (
              <Fragment key={match.id}>
                {/* START: header */}
                <div className="header bg-black text-white">
                  {beautifyMatchDate(match.start_date ?? '')
                    .split(';')
                    .map((text, index) => (
                      <Fragment key={index}>
                        {text}
                        <br />
                      </Fragment>
                    ))}
                  <br />
                </div>
                <div className="header odd text-black">{team1}</div>
                <div className="header even text-black">{team2}</div>
                {/* END: header */}
                {/* START: body */}
                {match?.match_set &&
                  match?.match_set?.length > 0 &&
                  match?.match_set?.map(
                    ({ team1_score, team2_score, name, no }) => (
                      <Fragment key={no}>
                        <div className="body bg-black text-white">{`R${no}`}</div>
                        <div className="body round odd text-black">
                          {name ? team1_score : '-'}
                        </div>
                        <div className="body round even text-black">
                          {name ? team2_score : '-'}
                        </div>
                      </Fragment>
                    )
                  )}

                {/* END: body */}
              </Fragment>
            )
          })}
      </div>
      {/* END: TABLE MOBILE */}
    </div>
  )
}

export default MatchSetScore
