import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';

const TopHeader = () => {
    const router = useRouter();
    const pathName = router.pathname === '/' ? 'HOME' : router.pathname.replace('/', '').toUpperCase().split('/')[0];

    // Clock Logic
    const [time, setTime] = useState(null);

    // Modal states
    const [showDiscordModal, setShowDiscordModal] = useState(false);
    const [showKakaoModal, setShowKakaoModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date, timeZone) => {
        if (!date) return "00:00";
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone
        });
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    const openModal = (type) => {
        if (type === 'discord') setShowDiscordModal(true);
        if (type === 'kakao') setShowKakaoModal(true);
        if (type === 'help') setShowHelpModal(true);
        setHasAgreed(false);
    };

    const closeModal = () => {
        setShowDiscordModal(false);
        setShowKakaoModal(false);
        setShowHelpModal(false);
        setHasAgreed(false);
    };

    return (
        <>
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 pointer-events-none select-none">
                {/* Left: Identity - Tech Badge */}
                <div className="flex items-center gap-4 pointer-events-auto group">
                    <LinkWrapper router={router} href="/">
                        <div className="relative flex items-center gap-3 bg-black/60 backdrop-blur-md border border-blue-500/30 px-4 py-2 hover:bg-black/80 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
                        >
                            <div className="relative w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
                                <Image
                                    src="/logo_image2.png"
                                    alt="Guild Logo"
                                    fill
                                    sizes="100px"
                                    style={{ objectFit: "contain" }}
                                    priority
                                />
                            </div>
                            <div className="flex flex-col pr-4">
                                <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] leading-none mb-0.5">AWAKEN</span>
                                <span className="text-sm font-black text-white tracking-widest leading-none">REUNITED</span>
                            </div>
                            {/* Decorative Corner */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
                        </div>
                    </LinkWrapper>
                </div>

                {/* Center: Location Pill - HUD Style (Hidden on mobile, shows on lg+) */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden lg:block transition-all duration-500`}>
                    <div className="relative bg-black/80 backdrop-blur-xl border-x border-b border-blue-500/30 px-12 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}
                    >
                        {/* Top Glow Line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_#3b82f6]" />

                        <span className="text-blue-100/90 font-mono text-xs font-bold tracking-[0.3em] flex items-center justify-center gap-3 uppercase">
                            <span className="w-1.5 h-1.5 rounded-sm bg-blue-500 animate-pulse shadow-[0_0_5px_#3b82f6]"></span>
                            {pathName}
                            <span className="w-1.5 h-1.5 rounded-sm bg-blue-500 animate-pulse shadow-[0_0_5px_#3b82f6]"></span>
                        </span>
                    </div>
                </div>

                {/* Mobile Clock - Center (Shows below lg only) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto block lg:hidden">
                    <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-blue-500/30 px-6 py-2 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                        style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)" }}>

                        {/* SRV Time */}
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-blue-500 font-mono tracking-widest font-bold">SRV</span>
                            <span className="text-lg text-white font-mono font-black tracking-widest drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                                {formatTime(time, 'America/Los_Angeles')}
                            </span>
                        </div>

                        {/* LOC Time */}
                        <div className="flex items-center gap-1.5 -mt-0.5">
                            <span className="text-[8px] text-blue-400/40 font-mono tracking-widest font-bold">LOC</span>
                            <span className="text-[10px] text-blue-200/50 font-mono font-medium">{formatTime(time)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: System Tray & Clock */}
                <div className="flex items-center gap-3 pointer-events-auto">

                    {/* Clock Panel (Hidden below lg, shows on lg+) */}
                    <div className="hidden lg:flex flex-col items-end justify-center bg-black/40 backdrop-blur-sm border-r border-blue-500/30 px-5 py-2 mr-[-5px] z-0 h-14"
                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}>

                        {/* SRV Time (Prominent) */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-blue-500 font-mono tracking-widest font-bold mt-1">SERVER</span>
                            <span className="text-lg md:text-xl xl:text-2xl text-white font-mono font-black tracking-widest drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                                {formatTime(time, 'America/Los_Angeles')}
                            </span>
                        </div>

                        {/* LOC Time (Secondary) */}
                        <div className="flex items-center gap-2 -mt-1">
                            <span className="text-[9px] text-blue-400/40 font-mono tracking-widest font-bold">LOCAL</span>
                            <span className="text-xs text-blue-200/50 font-mono font-medium">{formatTime(time)}</span>
                        </div>
                    </div>


                    {/* System Icons Panel */}
                    <div className="flex items-center bg-black/60 backdrop-blur-md border border-blue-500/30 p-1.5 shadow-[0_0_20px_rgba(37,99,235,0.1)] gap-1 z-10"
                        style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
                    >
                        {/* Left Decorative Border */}
                        <div className="absolute inset-y-0 left-0 w-[2px] bg-blue-500/20" />

                        {/* Discord Icon */}
                        <button onClick={() => openModal('discord')} className="p-2 text-white/60 hover:text-[#5865F2] hover:bg-white/5 transition-all duration-300 relative group overflow-hidden">
                            <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                            </svg>
                        </button>

                        {/* Kakao Icon */}
                        <button onClick={() => openModal('kakao')} className="p-2 text-white/50 hover:text-[#FEE500] hover:scale-110 transition-all duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.178.483.376.351.34-.226 3.778-2.565 4.39-2.986.239.034.484.053.734.053 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
                            </svg>
                        </button>

                        {/* Help Button */}
                        <button onClick={() => openModal('help')} className="p-2 text-white/50 hover:text-white hover:scale-110 transition-all duration-300">
                            <HelpOutlineIcon fontSize="small" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Discord/Kakao Modal */}
            {(showDiscordModal || showKakaoModal) && (
                <TechModal onClose={closeModal}>
                    {/* Header */}
                    <div className="border-b border-blue-500/20 pb-4 mb-6 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <GroupsIcon className="text-blue-400" />
                                {showDiscordModal ? 'Discord' : 'KakaoTalk'} Community
                            </h2>
                            <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase tracking-wider pl-1">
                                // ACCESS_REQUEST // PROTOCOL_V2
                            </p>
                        </div>
                        <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {!hasAgreed ? (
                            <div className="space-y-6 text-white/80 font-mono text-sm leading-relaxed pb-4">
                                <div className="bg-blue-500/10 border border-blue-500/30 p-4">
                                    <p className="text-blue-300">아래 링크는 어웨이큰 길드원들이 게임 관련 정보 공유 및 자유로운 대화를 나누기 위한 공식 커뮤니티입니다.</p>
                                    <p className="text-blue-300 mt-2">운영진이 상시 모니터링을 진행하고 있으나, 개인적인 사정으로 즉각 대응이 어려운 경우도 있을 수 있습니다.</p>
                                    <p className="text-blue-400 mt-2 flex items-center gap-2">
                                        <InfoIcon fontSize="small" />
                                        문제가 발생할 경우 개인 메시지(DM/개인톡) 또는 멘션/소환 기능을 이용해 주세요.
                                    </p>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
                                    <p className="text-yellow-400 font-bold flex items-center gap-2">
                                        <NotificationsActiveIcon fontSize="small" />
                                        건의사항 및 불만사항은
                                    </p>
                                    <p className="text-yellow-200/80 mt-2 pl-7">길드마스터 <span className="text-white font-bold">Nada</span>에게 개인 메시지(DM / 개인톡) 또는 게임 내 귓말로 전달해 주시기 바랍니다.</p>
                                </div>

                                <h3 className="text-xl font-bold text-blue-400 mt-6 flex items-center gap-2 uppercase tracking-widest border-b border-blue-500/20 pb-2">
                                    <CheckIcon fontSize="medium" />
                                    커뮤니티 이용 규칙
                                </h3>

                                <div className="space-y-8 pl-2">
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-blue-200">1. 온라인 예절 준수</h4>
                                        <p>모든 구성원은 서로를 존중하며 예의를 지켜 주세요.</p>
                                        <p className="text-red-400 mt-2 flex items-center gap-2">
                                            <WarningIcon fontSize="small" />
                                            아래 항목에 해당할 경우 사전 안내 없이 즉시 퇴장 조치될 수 있습니다.
                                        </p>

                                        <div className="mt-3 bg-red-500/5 border border-red-500/20 p-4">
                                            <p className="text-red-400 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                                <BlockIcon fontSize="small" />
                                                금지 사항
                                            </p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-red-200/70 text-xs pl-2">
                                                <li>부적절한 대화명 사용 (비속어, 광고성 이름, 운영진/타인 사칭 등)</li>
                                                <li>욕설, 비방, 모욕, 차별, 과도한 도배</li>
                                                <li>종교·정치·성별 갈등 조장 및 사적 의견 강요</li>
                                                <li>지나치게 장난스러운 답변, 의미 없는 잡담</li>
                                                <li>질문과 무관한 답변 반복</li>
                                                <li>커뮤니티 분위기를 해치는 비매너 행위 전반</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-blue-200">2. 검색 기능 및 외부 사이트 활용 권장</h4>
                                        <p>길드 커뮤니티는 빠른 질의응답이 장점이지만, 기본적인 게임 정보는 구글 검색 / 와우 인벤 등을 먼저 활용해 주세요.</p>
                                        <div className="mt-3 text-green-400/80 pl-4 space-y-1 font-bold text-xs uppercase tracking-wider">
                                            <p className="flex items-center gap-2"><SearchIcon fontSize="small" /> 더 정확한 정보 습득</p>
                                            <p className="flex items-center gap-2"><GroupsIcon fontSize="small" /> 원활한 소통</p>
                                            <p className="flex items-center gap-2"><CheckCircleIcon fontSize="small" /> 쾌적한 커뮤니티 유지</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-blue-200">3. 골드 및 개인 거래 관련 금지 사항</h4>
                                        <div className="bg-red-500/5 border border-red-500/20 p-4">
                                            <p className="text-red-400 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                                <BlockIcon fontSize="small" />
                                                금지 항목
                                            </p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-red-200/70 text-xs pl-2">
                                                <li>골드 거래 및 개인 간 거래 광고</li>
                                                <li>금전적 요구 (골드 베깅)</li>
                                                <li>사적인 요청 및 무리한 도움 요구 (예: "버스 태워주세요", "골드 좀 빌려주세요")</li>
                                            </ul>
                                            <p className="text-red-400 mt-3 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                                                <WarningIcon fontSize="small" />
                                                위반 시 관련 글은 사전 안내 없이 삭제, 즉시 추방 조치됩니다.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-blue-200">4. 대화명 변경 규칙 (입장 후 30분 이내 필수)</h4>
                                        <div className="bg-blue-500/10 border border-blue-500/30 p-4">
                                            <p className="text-blue-300 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                                <CheckIcon fontSize="small" />
                                                대화명 양식
                                            </p>
                                            <p className="text-blue-200 mt-2 pl-6">인게임 닉네임 (필수) / 옵셔널 (거주지역 · 주 특성 등)</p>
                                            <p className="text-white mt-2 flex items-center gap-2 pl-1">
                                                <LightbulbIcon fontSize="small" className="text-yellow-400" />
                                                예시: <span className="text-blue-400 font-bold">Nada / 서울 / 파흑</span>
                                            </p>

                                            <p className="text-yellow-400 mt-4 font-bold flex items-center gap-2 uppercase tracking-wider text-xs">
                                                <NotificationsActiveIcon fontSize="small" />
                                                미변경 시
                                            </p>
                                            <ul className="list-disc list-inside mt-1 text-yellow-200/70 pl-6 text-xs">
                                                <li>입장 후 30분 이내 미변경 시 자동 퇴장</li>
                                                <li>변경 전 작성한 메시지는 가려질 수 있음</li>
                                                <li>규칙 미준수로 퇴장된 경우 1개월 후 재입장 가능</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 h-full flex flex-col justify-center">
                                <div className="bg-green-500/10 border border-green-500/30 p-6 text-center">
                                    <p className="text-green-400 text-lg font-bold flex items-center justify-center gap-2 uppercase tracking-wider">
                                        <CheckCircleIcon />
                                        규칙에 동의하셨습니다
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {showDiscordModal && (
                                        <div className="bg-black/40 border border-[#5865F2]/30 p-6">
                                            <p className="text-[#5865F2] font-bold mb-3 uppercase tracking-wider text-xs">Discord Link</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value="https://discord.gg/mRwuc5pFCq"
                                                    readOnly
                                                    className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => handleCopy('https://discord.gg/mRwuc5pFCq', 'discord')}
                                                    className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                                >
                                                    {copied === 'discord' ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                                    {copied === 'discord' ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showKakaoModal && (
                                        <div className="bg-black/40 border border-[#FEE500]/30 p-6">
                                            <p className="text-[#FEE500] font-bold mb-3 uppercase tracking-wider text-xs">KakaoTalk Link</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value="https://open.kakao.com/o/gr9a08Se"
                                                    readOnly
                                                    className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => handleCopy('https://open.kakao.com/o/gr9a08Se', 'kakao')}
                                                    className="px-6 py-3 bg-[#FEE500] hover:bg-[#F5DC00] text-black transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                                >
                                                    {copied === 'kakao' ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                                    {copied === 'kakao' ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Sticky Bottom */}
                    <div className="border-t border-blue-500/20 pt-4 mt-2 flex justify-end gap-3 shrink-0">
                        {!hasAgreed ? (
                            <>
                                <button onClick={closeModal} className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold uppercase text-xs tracking-[0.2em]">
                                    Cancel
                                </button>
                                <button onClick={() => setHasAgreed(true)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                    <CheckIcon fontSize="small" />
                                    I Agree
                                </button>
                            </>
                        ) : (
                            <button onClick={closeModal} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all font-bold uppercase text-xs tracking-[0.2em]">
                                Close
                            </button>
                        )}
                    </div>
                </TechModal>
            )}

            {/* Help Modal */}
            {showHelpModal && (
                <TechModal onClose={closeModal}>
                    {/* Header */}
                    <div className="border-b border-blue-500/20 pb-4 mb-6 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <BugReportIcon className="text-blue-400" />
                                Bug Report & Suggestions
                            </h2>
                            <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase tracking-wider pl-1">
                                // FEEDBACK_CHANNEL // OPEN_LINE
                            </p>
                        </div>
                        <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <p className="text-white/80 font-mono text-sm leading-relaxed mb-8">
                            웹사이트 이용 중 버그를 발견하셨거나 개선에 대한 제안 사항이 있으신 경우,<br />
                            아래 채널을 통해 언제든지 편하게 문의해 주세요.
                        </p>

                        <div className="space-y-4">
                            {/* Discord */}
                            <div className="bg-black/40 border border-[#5865F2]/30 p-5">
                                <p className="text-[#5865F2] font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                                    </svg>
                                    Discord
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="bites"
                                        readOnly
                                        className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleCopy('bites', 'discord-help')}
                                        className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                    >
                                        {copied === 'discord-help' ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                        {copied === 'discord-help' ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                            </div>

                            {/* KakaoTalk */}
                            <div className="bg-black/40 border border-[#FEE500]/30 p-5">
                                <p className="text-[#FEE500] font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.178.483.376.351.34-.226 3.778-2.565 4.39-2.986.239.034.484.053.734.053 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
                                    </svg>
                                    KakaoTalk
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="Bites"
                                        readOnly
                                        className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleCopy('Bites', 'kakao-help')}
                                        className="px-6 py-3 bg-[#FEE500] hover:bg-[#F5DC00] text-black transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                    >
                                        {copied === 'kakao-help' ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                        {copied === 'kakao-help' ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-black/40 border border-blue-500/30 p-5">
                                <p className="text-blue-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                                    <EmailIcon fontSize="small" /> Email
                                </p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="procooho@gmail.com"
                                        readOnly
                                        className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleCopy('procooho@gmail.com', 'email')}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                                    >
                                        {copied === 'email' ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                        {copied === 'email' ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-blue-500/20 pt-4 mt-2 flex justify-end shrink-0">
                        <button onClick={closeModal} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all font-bold uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                            CLOSE
                        </button>
                    </div>
                </TechModal>
            )}
        </>
    );
};

// Shared Modal Layout Component
// Re-defined outside to prevent hydration/render flickering
const TechModal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-black/95 border border-blue-500/30 p-6 sm:p-8 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

            {/* Content Container (Scrollable) */}
            <div className="relative z-10 flex flex-col h-full overflow-hidden">
                {children}
            </div>
        </div>
    </div>
);

// Helper to avoid hydration mismatch if needed, but here straightforward link is fine
const LinkWrapper = ({ router, href, children }) => {
    return (
        <div onClick={() => router.push(href)}>
            {children}
        </div>
    )
}

export default TopHeader;
