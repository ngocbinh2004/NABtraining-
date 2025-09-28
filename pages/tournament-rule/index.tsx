import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {FaFileAlt} from "react-icons/fa";
import React, {useState} from 'react'
import Image from "@/molecules/media/Image";
import ImageComponent from "@/molecules/media/Image";
import { useTranslation } from 'next-i18next'



interface Props {
}

const rules = [
    {version: '2024.11.18', link: '#'},
    {version: '2024.11.18', link: '#'},
    {version: '2024.11.18', link: '#'},
    {version: '2024.11.18', link: '#'},
    {version: '2024.11.18', link: '#'},
    {version: '2024.11.18', link: '#'},
];

const TournamentRules = () => {
    const { t } = useTranslation('langs')
    return (
        <div className="flex justify-center items-center p-8 bg-gray-100">
            <div className="w-full max-w-screen-lg flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-green-900 mb-6 flex items-center">
                        <Image
                            classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
                            alt="news logo"
                            url="/assets/yellow_star.png"
                            imageClassNames="h-full rounded-t px-2 py-1"
                            objectFit="object-contain"
                        />
                        {t("TournamentPage.title")}
                    </h2>
                    < div className = "md:hidden flex justify-center mb-6" >
                        < ImageComponent
                            alt = "Tournament Mobile Logo"
                            url = "/assets/mobile-tournament.png"
                            width = {312}
                            height = {100}
                            classNames = "shadow-md object-cover"
                            />
                    </div>
                    <div className="grid gap-3 md:gap-4 w-full">
                        {rules.map((rule, index) => (
                            <div key={index}
                                 className="flex justify-between items-center bg-white p-3 w-full max-w-[580px] shadow-sm">
                                <div className="flex items-center">
                                    <Image
                                        classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
                                        alt="news logo"
                                        url="/assets/yellow_star.png"
                                        imageClassNames="h-full rounded-t px-2 py-1"
                                        objectFit="object-contain"
                                    />
                                    <span className="text-gray-700 font-medium">Ver.{rule.version}</span>
                                </div>
                                <a href={rule.link} className="flex items-center text-green-700 hover:underline">
                                    <FaFileAlt className="mr-2"/> {t("TournamentPage.link")}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden md:flex flex-1 justify-center items-center md:max-w-[320px] md:h-auto md:self-center">
                    <ImageComponent
                        alt="Tournament Logo"
                        url="/assets/tournament.png"
                        width={360}
                        height={260}
                        classNames="shadow-md object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async ({locale}: { locale: string }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    }
}

export default TournamentRules


