import React, { useEffect, useState, Fragment } from 'react'
import { cx } from 'class-variance-authority'
import { VscWorkspaceUnknown } from 'react-icons/vsc'
import Image from '@/molecules/media/Image'
import Pill from '@/atoms/Pill'
import { beautifyDate } from 'helpers/beautifyDate'
import { IMatches } from 'interfaces/match_type'
import { ILeague } from 'interfaces/league_type'
import Icon from '@/atoms/Icon'
import { useTranslation } from 'next-i18next'

interface MatchesListProps {
  league: ILeague
  matchesList: IMatches[]
}

export default function MatchesList({ league, matchesList }: MatchesListProps) {
  const { t } = useTranslation()
  const [weeks, setWeeks] = useState<{ start: number, end: number, matches: IMatches[] }[]>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth)
      }
    }
    const currentScrollRef = scrollRef.current
    if (currentScrollRef) {
      handleScroll()
      currentScrollRef.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current
        setShowRightArrow(scrollWidth > clientWidth)
      }
    }, 100)
  }, [matchesList])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!league?.start_date || !league?.end_date) return
    const startDate = new Date(Number(league.start_date))
    const endDate = new Date(Number(league.end_date))
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return
    }

    const weeksArray: { start: number, end: number, matches: IMatches[] }[] = []
    let currentStart = new Date(startDate.getTime())

    while (currentStart <= endDate) {
      const currentEnd = new Date(currentStart.getTime())
      currentEnd.setDate(currentStart.getDate() + 6)
      weeksArray.push({ start: currentStart.getTime(), end: currentEnd.getTime(), matches: [] })
      currentStart = new Date(currentStart.setDate(currentStart.getDate() + 7))
    }

    matchesList.forEach((match) => {
      for (const week of weeksArray) {
        if (match.start_date && Number(match.start_date) >= Number(week.start) && Number(match.start_date) <= Number(week.end)) {
          week.matches.push(match)
          break
        }
      }
    })

    setWeeks(weeksArray)
  }, [league, matchesList])

  return (
    <div className={cx('relative text-white w-full',
      isMobile ? 'h-[102px]' : 'h-[156px]'
    )}
    >
      {!isMobile ? (
        showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none">
            <button
              onClick={scrollLeft}
              className="w-[100px] h-full bg-gradient-to-r from-[#EFEFEF] to-[#EFEFEF00] flex items-center justify-end pointer-events-auto z-50"
            >
              <div className="background-green p-2">
                <Icon icon="caret" width={28} height={28} classNames="text-white rotate-90" />
              </div>
            </button>
          </div>
        )
      ) : (
        showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none">
            <div className="w-[70px] h-full bg-gradient-to-r from-[#EFEFEF] to-[#EFEFEF00] flex items-center justify-end z-50"></div>
          </div>
        )
      )}
      <div ref={scrollRef} className="flex overflow-x-auto w-full h-full bg-white relative">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-row h-full">
            <div className={cx('h-full background-green flex flex-col items-center justify-center p-2',
              isMobile ? 'w-[82px]' : 'w-[98px]')}>
              <span className={cx('text-center text-white leading-tight',
                isMobile ? 'text-[12px]' : 'text-[16px]'
              )}>{t('MatchesList.schedule')}</span>
              <span className={cx('text-[#D4B686] leading-tight',
                isMobile ? 'text-[14px]' : 'text-[20px]'
              )}>{t('MatchesList.week')} {weekIndex + 1}</span>
            </div>
            <div className="flex flex-row items-center h-full">
              {week.matches.length > 0 ? (
                week.matches.map((match, index) => {
                  const currentTime = Date.now()
                  const startTime = Number(match.start_date)
                  const endTime = Number(match.end_date)
                  let status = t('MatchesList.upcoming')
                  if (currentTime >= startTime && currentTime < endTime) {
                    status = t('MatchesList.live')
                  } else if (currentTime >= endTime) {
                    status = t('MatchesList.final')
                  }
                  return (
                    <Fragment key={index}>
                      {index < matchesList.length - 1 && index != 0 && (
                        <div className="mx-2 h-[80%] w-px bg-[#d9d9d9]"></div>
                      )}
                      <div className={cx('flex-shrink-0 p-2 bg-white relative mt-px',
                        isMobile ? 'w-[170px]' : 'w-[290px] ml-2 mr-2')}>
                        <div className={cx('flex justify-between mb-2',
                          isMobile ? 'text-[12px]' : 'text-[16px]')}>
                          <span className="text-black">
                            {status === t('MatchesList.live') ? <Pill classNames={cx('', isMobile ? 'text-[12px]' : 'text-[14px]')}>{status}</Pill> : status}
                          </span>
                          {match.start_date && (
                            <span className="text-[#525252]">{beautifyDate(match.start_date)}</span>
                          )}
                        </div>
                        <div className="flex items-center mb-2 ml-px">
                          {match.team1.logo ? (
                            <Image url={match.team1.logo} alt={match.team1?.name} width={isMobile ? 24 : 40} height={isMobile ? 24 : 40} />
                          ) : (
                            <VscWorkspaceUnknown className='text-green' style={{ width: isMobile ? 24 : 40, height: isMobile ? 24 : 40 }} />
                          )}
                          <span className={cx('ml-2 text-black flex-1',
                            isMobile ? 'text-[12px]' : 'text-[24px]'
                          )}>{match.team1?.name}</span>
                          <span className={cx('text-black flex items-center',
                            isMobile ? 'text-[12px]' : 'text-[24px]'
                          )}>
                            {match.team1_win}
                            <span
                              className={cx('text-[#ff5900] ml-1 transform -rotate-90 transition-opacity duration-300',
                                isMobile ? 'text-[10px]' : 'text-[16px]'
                              )}
                              style={{ opacity: match.team1_win > match.team2_win ? 1 : 0 }}
                            > ▲ </span>
                          </span>
                        </div>
                        <div className="flex items-center ml-px">
                          {match.team2.logo ? (
                            <Image url={match.team2.logo} alt={match.team2?.name} width={isMobile ? 24 : 40} height={isMobile ? 24 : 40} />
                          ) : (
                            <VscWorkspaceUnknown className='text-green' style={{ width: isMobile ? 24 : 40, height: isMobile ? 24 : 40 }} />
                          )}
                          <span className={cx('ml-2 text-black flex-1',
                            isMobile ? 'text-[12px]' : 'text-[24px]'
                          )}>{match.team2?.name}</span>
                          <span className={cx('text-black flex items-center',
                            isMobile ? 'text-[12px]' : 'text-[24px]'
                          )}>
                            {match.team2_win}
                            <span className={cx('text-[#ff5900] ml-1 transform -rotate-90 transition-opacity duration-300',
                              isMobile ? 'text-[10px]' : 'text-[16px]'
                            )}
                              style={{ opacity: match.team2_win > match.team1_win ? 1 : 0 }}
                            > ▲ </span>
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  )
                })
              ) : (
                <div className={cx('flex items-center justify-center bg-white text-black text-center',
                  isMobile ? 'w-[140px] h-[102px] text-[14px]' : 'w-[280px] h-[156px] text-[20px]'
                )}>
                  {t('MatchesList.no_match')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {!isMobile ? (
        showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
            <button
              onClick={scrollRight}
              className="w-[100px] h-full bg-gradient-to-l from-[#EFEFEF] to-[#EFEFEF00] flex items-center justify-start pointer-events-auto z-50"
            >
              <div className="background-green p-2">
                <Icon icon="caret" width={28} height={28} classNames="text-white -rotate-90" />
              </div>
            </button>
          </div>
        )
      ) : (
        showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
            <div className="w-[70px] h-full bg-gradient-to-l from-[#EFEFEF] to-[#EFEFEF00] flex items-center justify-start z-50"></div>
          </div>
        )
      )}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
         display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
         scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
